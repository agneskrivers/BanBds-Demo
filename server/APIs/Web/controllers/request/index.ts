import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { RequestsModel } from '@server/models';

// Interfaces
import type { ResJSON, IRequestCreate, IApiWebReqLocals } from '@interfaces';

// Request Type
type ReqBody = Omit<IRequestCreate, 'userID' | 'status'>;

// Function Type
type ApiWebRequest = (
    req: Request<unknown, unknown, ReqBody, unknown, IApiWebReqLocals>,
    res: Response<ResJSON>
) => Promise<void>;

const Index: ApiWebRequest = async (req, res) => {
    try {
        if (!req.res) {
            const { statusCode, message } = new createHttpError.Unauthorized();

            res.status(statusCode).json({ status: 'Unauthorized', message });

            return;
        }

        const { userID } = req.res.locals;

        const isCreate = await RequestsModel.createRequest({
            ...req.body,
            userID,
            status: 'pending',
        });

        if (!isCreate) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        res.status(200).json({ status: 'Success' });
    } catch (error) {
        const { message } = error as Error;

        handleError('API Web Request', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
