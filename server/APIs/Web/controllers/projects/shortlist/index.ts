import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { ProjectsModel } from '@server/models';

// Interfaces
import type {
    ResJSON,
    IApiWebProjectShortlistReqQuery,
    IApiWebProjectShortlist,
    IPostFilterByValue,
    ITotalsByAreas,
} from '@interfaces';

// Function Type
type ApiWebProjectShortlist = (
    req: Request<unknown, unknown, unknown, IApiWebProjectShortlistReqQuery>,
    res: Response<ResJSON<IApiWebProjectShortlist>>
) => Promise<void>;

const Index: ApiWebProjectShortlist = async (req, res) => {
    const {
        page,
        district,
        pricesMax,
        pricesMin,
        region,
        search,
        status,
        type,
    } = req.query;

    try {
        if (isNaN(parseInt(page))) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        let prices: IPostFilterByValue | undefined;

        if (pricesMax && pricesMin) {
            if (isNaN(parseInt(pricesMax)) && isNaN(parseInt(pricesMin))) {
                const { statusCode, message } =
                    new createHttpError.BadRequest();

                res.status(statusCode).json({ status: 'Not Process', message });

                return;
            }

            const min = parseInt(pricesMin);
            const max = parseInt(pricesMax);

            prices = { min, max };
        }

        const projects = await ProjectsModel.getShortlistForWeb(
            parseInt(page) - 1,
            region,
            district,
            search,
            type,
            status,
            prices
        );

        if (!projects) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        let areas: ITotalsByAreas[] | null = null;

        if (!region && !district) {
            areas = await ProjectsModel.getTotalsByAreas();
        } else if (region && !district) {
            areas = await ProjectsModel.getTotalsByAreas(region);
        }

        res.status(200).json({
            status: 'Success',
            data: { ...projects, areas },
        });
    } catch (error) {
        const { message } = error as Error;

        handleError('API Web Project Shortlist', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
