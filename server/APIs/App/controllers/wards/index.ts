import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { WardsModel } from '@server/models';

// Interfaces
import type { ResJSON, IWard } from '@interfaces';

// Function Type
type ApiAppWards = (
    req: Request,
    res: Response<ResJSON<IWard[]>>
) => Promise<void>;

const Index: ApiAppWards = async (_, res) => {
    try {
        const data = await WardsModel.getList();

        if (!data) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        res.status(200).json({ status: 'Success', data });
    } catch (error) {
        const { message } = error as Error;

        handleError('API App Wards', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
