import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { ProjectsModel } from '@server/models';

// Interfaces
import type { ResJSON, IResultGetShortlistForApp } from '@interfaces';

// Request Interface
interface ReqQuery {
    page: string;
    region: string;
    id?: string;
}

// Function Type
type ApiAppProjectShortlist = (
    req: Request<unknown, unknown, unknown, ReqQuery>,
    res: Response<ResJSON<IResultGetShortlistForApp>>
) => Promise<void>;

const Index: ApiAppProjectShortlist = async (req, res) => {
    const { page, region, id } = req.query;

    try {
        if (isNaN(parseInt(page))) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        const data = await ProjectsModel.getShortlistForApp(
            parseInt(page) - 1,
            region,
            id
        );

        if (!data) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        res.status(200).json({ status: 'Success', data });
    } catch (error) {
        const { message } = error as Error;

        handleError('API App Project Shortlist', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
