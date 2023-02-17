import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { NewsModel, PostsModel, ProjectsModel } from '@server/models';

// Interfaces
import type { ResJSON, IApiWebDashboard } from '@interfaces';

// Function Type
type ApiWebDashboard = (
    req: Request,
    res: Response<ResJSON<IApiWebDashboard>>
) => Promise<void>;

const Index: ApiWebDashboard = async (req, res) => {
    try {
        const sell = await PostsModel.getForDashboardWeb('sell', 0);
        const rent = await PostsModel.getForDashboardWeb('rent', 0);
        const news = await NewsModel.getForDashboardWeb();
        const projects = await ProjectsModel.getForDashboardWeb();
        const areas = await PostsModel.getTotalsByAreasForDashboardWeb();

        const data: IApiWebDashboard = {
            areas,
            news,
            projects,
            rent,
            sell,
        };

        res.status(200).json({ status: 'Success', data });
    } catch (error) {
        const { message } = error as Error;

        handleError('API Web District', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
