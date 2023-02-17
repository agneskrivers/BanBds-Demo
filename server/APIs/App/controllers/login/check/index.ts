import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { OTPsModel, UsersModel } from '@server/models';

// Interfaces
import type {
    ResJSON,
    IApiReqParamsPhoneNumber,
    IApiLoginCheckReqBody,
    IApiAppLoginCheckResult,
} from '@interfaces';

// Function Type
type ApiAppLoginCheck = (
    req: Request<IApiReqParamsPhoneNumber, unknown, IApiLoginCheckReqBody>,
    res: Response<ResJSON<IApiAppLoginCheckResult>>
) => Promise<void>;

const Index: ApiAppLoginCheck = async (req, res) => {
    const { phoneNumber } = req.params;

    const { otp } = req.body;

    try {
        const checkPhoneNumber = await OTPsModel.findOne({ phoneNumber });

        if (!checkPhoneNumber) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        const isOTP = await checkPhoneNumber.check(otp);

        if (!isOTP) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        const checkUser = await UsersModel.findOne({ phoneNumber });

        if (!checkUser) {
            res.status(200).json({
                status: 'Success',
                data: { isCreated: false },
            });

            return;
        }

        const token = await checkUser.generateToken('app');

        if (!token) {
            res.status(202).json({ status: 'Not Process', message: 'Token' });

            return;
        }

        res.status(200).json({
            status: 'Success',
            data: { isCreated: true, token },
        });
    } catch (error) {
        const { message } = error as Error;

        handleError('API App Init', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
