import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { RegionsModel } from '@server/models';

// Interfaces
import type { ResJSON, IRegionCompact } from '@interfaces';

// Function Type
type ApiAppRegions = (
    req: Request,
    res: Response<ResJSON<IRegionCompact[]>>
) => Promise<void>;

const Index: ApiAppRegions = async (_, res) => {
    try {
        const data = await RegionsModel.getShortlist();

        if (!data) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        res.status(200).json({ status: 'Success', data });
    } catch (error) {
        const { message } = error as Error;

        handleError('API App Regions', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
