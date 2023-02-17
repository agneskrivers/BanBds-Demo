import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { PostsModel } from '@server/models';

// Interfaces
import type {
    ResJSON,
    IApiAppPostShortlistForAppResult,
    IApiAppPostShortlistReqQuery,
    IPostSort,
    IPostFilter,
    IPostFilterByValue,
} from '@interfaces';

// Function Type
type ApiAppPostShortlist = (
    req: Request<unknown, unknown, unknown, IApiAppPostShortlistReqQuery>,
    res: Response<ResJSON<IApiAppPostShortlistForAppResult>>
) => Promise<void>;

const Index: ApiAppPostShortlist = async (req, res) => {
    const {
        page,
        type,
        acreages,
        acreagesMax,
        acreagesMin,
        category,
        createdAt,
        prices,
        pricesMax,
        pricesMin,
        region,
        search,
        district,
    } = req.query;

    try {
        if (isNaN(parseInt(page))) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        let filter: IPostFilter | undefined = undefined;
        let sort: IPostSort | undefined = undefined;

        let acreagesFilter: IPostFilterByValue | undefined = undefined;
        let pricesFilter: IPostFilterByValue | undefined = undefined;

        if (pricesMin && pricesMax) {
            if (isNaN(parseFloat(pricesMin)) || isNaN(parseFloat(pricesMax))) {
                const { statusCode, message } =
                    new createHttpError.BadRequest();

                res.status(statusCode).json({ status: 'Not Process', message });

                return;
            }

            const min = parseFloat(pricesMin);
            const max = parseFloat(pricesMax);

            pricesFilter = {
                min,
                max,
            };
        }

        if (acreagesMin && acreagesMax) {
            if (
                isNaN(parseFloat(acreagesMin)) ||
                isNaN(parseFloat(acreagesMax))
            ) {
                const { statusCode, message } =
                    new createHttpError.BadRequest();

                res.status(statusCode).json({ status: 'Not Process', message });

                return;
            }

            const min = parseFloat(acreagesMin);
            const max = parseFloat(acreagesMax);

            acreagesFilter = { min, max };
        }

        if (category) {
            filter = { category };
        }

        if (acreagesFilter) {
            filter = { ...(filter ? filter : {}), acreages: acreagesFilter };
        }

        if (pricesFilter) {
            filter = { ...(filter ? filter : {}), prices: pricesFilter };
        }

        if (acreages) {
            sort = { acreages };
        }

        if (prices) {
            sort = { prices };
        }

        if (createdAt) {
            sort = { createdAt };
        }

        const data = await PostsModel.getShortlistForApp(
            parseInt(page) - 1,
            type,
            region,
            district,
            search,
            filter,
            sort
        );

        if (!data) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        res.status(200).json({ status: 'Success', data });
    } catch (error) {
        const { message } = error as Error;

        handleError('API App Post Shortlist', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
