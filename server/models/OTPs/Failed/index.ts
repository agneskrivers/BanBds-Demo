import { model, Model, Schema } from 'mongoose';

// Enums
import { LimitOTP } from '@server/enums';

// Helpers
import { handleError } from '@server/helpers';

// Interfaces
import type { IOtpTracking } from '@interfaces';

// Model Interface
interface FailedOtpModel extends Model<IOtpTracking> {
    createPhoneNumber(phoneNumber: string): Promise<boolean>;
    check(phoneNumber: string): Promise<boolean>;
}

// Schema
const FailedOtpSchema = new Schema<IOtpTracking, FailedOtpModel>(
    {
        phoneNumber: {
            type: String,
            required: true,
            immutable: true,
            unique: true,
        },
        expiredAt: { type: Date, required: true },
    },
    {
        timestamps: false,
    }
);

FailedOtpSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

// Statics
FailedOtpSchema.statics.createPhoneNumber = async function (
    phoneNumber: string
): Promise<boolean> {
    try {
        const checkPhoneNumber = await this.findOne({ phoneNumber });

        const expiredAt = new Date(Date.now() + LimitOTP.failed);

        if (checkPhoneNumber) {
            checkPhoneNumber.expiredAt = expiredAt;

            await checkPhoneNumber.save();

            return true;
        }

        const newPhoneNumber = new this({
            phoneNumber,
            expiredAt,
        });

        await newPhoneNumber.save();

        return true;
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Failed OTPs Static Create', message);

        return false;
    }
};
FailedOtpSchema.statics.check = async function (
    phoneNumber: string
): Promise<boolean> {
    try {
        const checkPhoneNumber = await this.findOne({ phoneNumber });

        if (checkPhoneNumber) return true;

        return false;
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Failed OTPs Static Check', message);

        return false;
    }
};

// Model
const Index = model<IOtpTracking, FailedOtpModel>(
    'FailedOTPs',
    FailedOtpSchema
);

export default Index;
