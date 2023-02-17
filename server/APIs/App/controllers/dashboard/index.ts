import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Models
import { handleError } from '@server/helpers';

// Models
import { PostsModel, ProjectsModel } from '@server/models';

// Interfaces
import type { ResJSON, IApiAppDashboardResult } from '@interfaces';

// Request Interface
interface ReqQuery {
    region: string;
}

// Function Type
type ApiAppDashboard = (
    req: Request<unknown, unknown, unknown, ReqQuery>,
    res: Response<ResJSON<IApiAppDashboardResult>>
) => Promise<void>;

const Index: ApiAppDashboard = async (req, res) => {
    const { region } = req.query;

    try {
        const shortlistPosts = await PostsModel.getShortlistForApp(
            0,
            'sell',
            region
        );
        const shortlistProjects = await ProjectsModel.getShortlistForApp(
            0,
            region
        );

        if (!shortlistPosts || !shortlistProjects) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        const posts = shortlistPosts.posts;
        const totals = shortlistPosts.totals;
        const projects = shortlistProjects.projects;

        res.status(200).json({
            status: 'Success',
            data: { posts, projects, totals },
        });
    } catch (error) {
        const { message } = error as Error;

        handleError('API App Dashboard', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
