import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { OTPsModel, RenewOTPsModel, FailedOTPsModel } from '@server/models';

// Interfaces
import type { ResJSON, IApiReqParamsPhoneNumber } from '@interfaces';

// Function Type
type ApiAppLoginSend = (
    req: Request<IApiReqParamsPhoneNumber>,
    res: Response<ResJSON>
) => Promise<void>;

const Index: ApiAppLoginSend = async (req, res) => {
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

        const status = await OTPsModel.send(phoneNumber);

        if (!status) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        if (status === 'failed') {
            res.status(202).json({ status: 'Not Process', message: 'Failed' });

            return;
        }

        if (status === 'renew') {
            res.status(202).json({ status: 'Not Process', message: 'Renew' });

            return;
        }

        res.status(200).json({ status: 'Success' });
    } catch (error) {
        const { message } = error as Error;

        handleError('API App Login Sent', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
