import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';

// Configs
import { pathTemp } from '@server/configs';

// Helpers
import { handleError } from '@server/helpers';

// Interfaces
import type { ResJSON } from '@interfaces';

// Request Interface
interface ReqBody {
    fileName: string;
}

// Function Type
type ApiCommonImagesRemove = (
    req: Request<unknown, unknown, ReqBody>,
    res: Response<ResJSON>
) => Promise<void>;

const Index: ApiCommonImagesRemove = async (req, res) => {
    const { fileName } = req.body;

    const pathFile = path.join(pathTemp, fileName);

    try {
        if (fs.existsSync(pathFile)) {
            await fsPromises.unlink(pathFile);
        }

        res.status(200).json({ status: 'Success' });
    } catch (error) {
        const { message } = error as Error;

        handleError('API Common Images Remove', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
