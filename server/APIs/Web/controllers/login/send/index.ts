import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { OTPsModel, RenewOTPsModel, FailedOTPsModel } from '@server/models';

// Interfaces
import type { ResJSON, IApiReqParamsPhoneNumber } from '@interfaces';

// Function Type
type ApiWebLoginSend = (
    req: Request<IApiReqParamsPhoneNumber>,
    res: Response<ResJSON<{ otp: string }>>
) => Promise<void>;

const Index: ApiWebLoginSend = async (req, res) => {
    const { phoneNumber } = req.params;

    try {
        const checkRenew = await RenewOTPsModel.findOne({ phoneNumber });
        const checkFailed = await FailedOTPsModel.findOne({ phoneNumber });

        if (checkRenew) {
            res.status(202).json({ status: 'Not Process', message: 'Renew' });

            return;
        }

        if (checkFailed) {
            res.status(202).json({ status: 'Not Process', message: 'Failed' });

            return;
        }

        const data = await OTPsModel.send(phoneNumber);

        if (!data) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        if (data === 'failed') {
            res.status(202).json({ status: 'Not Process', message: 'Failed' });

            return;
        }

        if (data === 'renew') {
            res.status(202).json({ status: 'Not Process', message: 'Renew' });

            return;
        }

        res.status(200).json({ status: 'Success', data });
    } catch (error) {
        const { message } = error as Error;

        handleError('API Web Login Send', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
