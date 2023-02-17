import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { RequestsModel } from '@server/models';

// Interfaces
import type { ResJSON, IRequestCreate, IApiAppReqLocals } from '@interfaces';

// Request Type
type ReqBody = Omit<IRequestCreate, 'userID'>;

// Function Type
type ApiAppRequest = (
    req: Request<unknown, unknown, ReqBody, unknown, IApiAppReqLocals>,
    res: Response<ResJSON>
) => Promise<void>;

const Index: ApiAppRequest = async (req, res) => {
    try {
        if (!req.res) throw new Error('Response Locals Not Found!');

        const { userID } = req.res.locals;

        const isCreate = await RequestsModel.createRequest({
            ...req.body,
            userID,
        });

        if (!isCreate) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        res.status(200).json({ status: 'Success' });
    } catch (error) {
        const { message } = error as Error;

        handleError('API App Request', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
