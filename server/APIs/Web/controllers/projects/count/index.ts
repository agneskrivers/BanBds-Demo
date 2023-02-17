import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { ProjectsModel } from '@server/models';

// Interfaces
import type { ResJSON } from '@interfaces';

// Request Interface
interface ReqParams {
    projectID: string;
}

// Function Type
type ApiWebProjectCount = (
    req: Request<ReqParams>,
    res: Response<ResJSON>
) => Promise<void>;

const Index: ApiWebProjectCount = async (req, res) => {
    const { projectID } = req.params;

    try {
        if (isNaN(parseInt(projectID))) {
            const { statusCode, message } = new createHttpError.NotFound();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        const data = await ProjectsModel.countViews(parseInt(projectID));

        if (!data) {
            const { statusCode, message } = new createHttpError.NotFound();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        res.status(200).json({ status: 'Success' });
    } catch (error) {
        const { message } = error as Error;

        handleError('API Web Project Count', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
