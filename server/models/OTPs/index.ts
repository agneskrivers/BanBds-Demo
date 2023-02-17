import { model, Model, Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import otpGenerate from 'otp-generator';

// Configs
import { LimitRenewOTP, LimitFailedOTP } from '@server/configs';

// Enums
import { LimitOTP } from '@server/enums';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { FailedOTPsModel, RenewOTPsModel } from '@server/models';

// Services
import services from '@server/services';

// Interfaces
import type { IOtp } from '@interfaces';

// Type
type ResultSend = 'sent' | 'failed' | 'renew' | null;

// Methods Interface
interface OtpMethods extends IOtp, Document {
    check(otp: string): Promise<boolean>;
}

// Model Interface
interface OtpModel extends Model<IOtp, Record<string, string>, OtpMethods> {
    send(phoneNumber: string): Promise<ResultSend>;
}

// Schema
const OtpSchema = new Schema<IOtp, OtpModel, OtpMethods>(
    {
        phoneNumber: {
            type: String,
            required: true,
            immutable: true,
            unique: true,
        },
        otp: { type: String, required: true },
        expiredAt: { type: Date, required: true },
        renew: { type: Number, default: 0 },
        failed: { type: Number, default: 0 },
        isHash: { type: Boolean, required: true },
    },
    {
        timestamps: false,
    }
);

OtpSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

// Pre
OtpSchema.pre('save', async function (next) {
    try {
        if (this.isHash) {
            const rounds = Math.floor(Math.random() * 11) + 1;

            const salt = await bcrypt.genSalt(rounds);
            const hash = await bcrypt.hash(this.otp, salt);

            this.otp = hash;
            this.isHash = false;
        }

        next();
    } catch (error) {
        const { message } = error as Error;

        handleError('Model OTPs Pre Save', message);

        next(error as Error);
    }
});

// Statics
OtpSchema.statics.send = async function (
    phoneNumber: string
): Promise<ResultSend> {
    const otp = otpGenerate.generate(4, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
    });

    try {
        const checkPhoneNumber = await this.findOne({ phoneNumber });

        if (checkPhoneNumber) {
            if (checkPhoneNumber.renew >= LimitRenewOTP) {
                const isLimitRenew = await RenewOTPsModel.createPhoneNumber(
                    phoneNumber
                );

                if (isLimitRenew) {
                    await checkPhoneNumber.remove();
                }

                return 'renew';
            }

            if (checkPhoneNumber.failed >= LimitFailedOTP) {
                const isLimitFailed = await FailedOTPsModel.createPhoneNumber(
                    phoneNumber
                );

                if (isLimitFailed) {
                    await checkPhoneNumber.remove();
                }

                return 'failed';
            }

            const isSent = await services.sms(phoneNumber, otp);

            if (!isSent) return null;

            const updateRenew = checkPhoneNumber.renew + 1;

            checkPhoneNumber.otp = otp;
            checkPhoneNumber.expiredAt = new Date(Date.now() + LimitOTP.otp);
            checkPhoneNumber.renew = updateRenew;
            checkPhoneNumber.isHash = true;

            await checkPhoneNumber.save();

            return 'sent';
        }

        const isSent = await services.sms(phoneNumber, otp);

        if (!isSent) return null;

        const expiredAt = new Date(Date.now() + LimitOTP.otp);

        const newPhoneNumber = new this({
            phoneNumber,
            otp,
            expiredAt,
            isHash: true,
        });

        await newPhoneNumber.save();

        return 'sent';
    } catch (error) {
        const { message } = error as Error;

        handleError('Model OTPs Static Send', message);

        return null;
    }
};

// Methods
OtpSchema.methods.check = async function (otp) {
    try {
        const isOTP = await bcrypt.compare(otp, this.otp);

        if (!isOTP) {
            const updateFailed = this.failed + 1;

            if (updateFailed >= LimitFailedOTP) {
                const isLimitFailed = await FailedOTPsModel.createPhoneNumber(
                    this.phoneNumber
                );

                if (isLimitFailed) {
                    await this.remove();

                    return false;
                }
            }

            this.failed = updateFailed;

            await this.save();

            return false;
        }

        await this.remove();

        return true;
    } catch (error) {
        const { message } = error as Error;

        handleError('Model OTPs Method Check', message);

        return false;
    }
};

// Model
const Index = model<IOtp, OtpModel>('OTPs', OtpSchema);

export default Index;
