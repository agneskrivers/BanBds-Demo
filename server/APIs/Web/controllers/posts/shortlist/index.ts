import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { PostsModel, ProjectsModel } from '@server/models';

// Interfaces
import type {
    ResJSON,
    IApiWebPostShortlist,
    IApiWebPostShortlistReqQuery,
    IPostFilter,
    IPostSort,
    IPostFilterByValue,
    ITotalsByAreas,
} from '@interfaces';

// Function Type
type ApiWebPostShortlist = (
    req: Request<unknown, unknown, unknown, IApiWebPostShortlistReqQuery>,
    res: Response<ResJSON<IApiWebPostShortlist>>
) => Promise<void>;

const Index: ApiWebPostShortlist = async (req, res) => {
    const {
        page,
        type,
        acreages,
        acreagesMax,
        acreagesMin,
        category,
        createdAt,
        district,
        prices,
        pricesMax,
        pricesMin,
        project,
        region,
        search,
    } = req.query;

    try {
        if (isNaN(parseInt(page))) {
            const { status, message } = new createHttpError.BadRequest();

            res.status(status).json({ status: 'Not Process', message });

            return;
        }

        let filter: IPostFilter = {};
        let sort: IPostSort | undefined;

        let acreagesFilter: IPostFilterByValue | undefined;
        let pricesFilter: IPostFilterByValue | undefined;

        if (
            pricesMin &&
            pricesMax &&
            !isNaN(parseInt(pricesMin)) &&
            !isNaN(parseInt(pricesMax))
        ) {
            const min = parseInt(pricesMin);
            const max = parseInt(pricesMax);

            pricesFilter = { min, max };
        }

        if (
            acreagesMin &&
            acreagesMax &&
            !isNaN(parseInt(acreagesMin)) &&
            !isNaN(parseInt(acreagesMax))
        ) {
            const min = parseInt(acreagesMin);
            const max = parseInt(acreagesMax);

            acreagesFilter = { min, max };
        }

        if (category) {
            filter = { ...filter, category };
        }

        if (acreagesFilter) {
            filter = { ...filter, acreages: acreagesFilter };
        }

        if (pricesFilter) {
            filter = { ...filter, prices: pricesFilter };
        }

        if (createdAt) {
            sort = { createdAt };
        }

        if (acreages) {
            sort = { acreages };
        }

        if (prices) {
            sort = { prices };
        }

        const result = await PostsModel.getShortlistForWeb(
            parseInt(page) - 1,
            type,
            region,
            district,
            search,
            project,
            filter,
            sort
        );
        const projects = await ProjectsModel.getListSelectForWeb();

        if (!result || !projects) {
            const { status, message } = new createHttpError.BadRequest();

            res.status(status).json({ status: 'Not Process', message });

            return;
        }

        let areas: ITotalsByAreas[] | null = null;

        if ((!region && !district) || (region && !district)) {
            areas = await PostsModel.getTotalsByAreas(
                type,
                region ? region : undefined
            );
        }

        res.status(200).json({
            status: 'Success',
            data: { ...result, projects, areas },
        });
    } catch (error) {
        const { message } = error as Error;

        handleError('API Web Post Shortlist', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
