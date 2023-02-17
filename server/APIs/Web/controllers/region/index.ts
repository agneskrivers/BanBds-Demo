import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError, convertToEnglish } from '@server/helpers';

// Models
import { RegionsModel } from '@server/models';

// Interfaces
import type { ResJSON, IApiWebRegion } from '@interfaces';

// Request Query
interface ReqQuery {
    region: string;
}

// Function Type
type ApiWebRegion = (
    req: Request<unknown, unknown, unknown, ReqQuery>,
    res: Response<ResJSON<IApiWebRegion>>
) => Promise<void>;

const Index: ApiWebRegion = async (req, res) => {
    const { region } = req.query;

    try {
        const regions = await RegionsModel.find();

        const findRegion = [...regions].find(
            (item) => convertToEnglish(item.name).replace(/\s/g, '-') === region
        );

        if (!findRegion || !findRegion.isActive) {
            const { status, message } = new createHttpError.NotFound();

            res.status(status).json({ status: 'Not Process', message });

            return;
        }

        const { regionID, name } = findRegion;

        res.status(200).json({ status: 'Success', data: { regionID, name } });
    } catch (error) {
        const { message } = error as Error;

        handleError('API Web Region', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
