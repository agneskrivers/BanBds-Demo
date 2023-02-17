import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { ProjectsModel, PostsModel } from '@server/models';

// Interfaces
import type { ResJSON, IApiWebProjectInfo } from '@interfaces';

// Request Interface
interface ReqParams {
    projectID: string;
}

// Function Type
type ApiWebProjectInfo = (
    req: Request<ReqParams>,
    res: Response<ResJSON<IApiWebProjectInfo>>
) => Promise<void>;

const Index: ApiWebProjectInfo = async (req, res) => {
    const { projectID } = req.params;

    try {
        if (isNaN(parseInt(projectID))) {
            const { statusCode, message } = new createHttpError.NotFound();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        const data = await ProjectsModel.getInfo(parseInt(projectID));

        if (!data) {
            const { statusCode, message } = new createHttpError.NotFound();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        const posts = await PostsModel.getForProject(data.id);

        res.status(200).json({ status: 'Success', data: { data, posts } });
    } catch (error) {
        const { message } = error as Error;

        handleError('API Web Project Info', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
