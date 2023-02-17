import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import fs from 'fs';
import path from 'path';

// Configs
import { pathTemp } from '@server/configs';

// Helpers
import { handleError } from '@server/helpers';
import { convertHEIC, convertSize } from '@server/helpers/Common';

// Interfaces
import type { ResUploadImageJSON } from '@interfaces';

// Request Interface
interface ReqBody {
    avatar: string;
}

// Function Type
type ApiCommonImagesUpload = (
    req: Request<unknown, unknown, ReqBody>,
    res: Response<ResUploadImageJSON>
) => Promise<void>;

const Index: ApiCommonImagesUpload = async (req, res) => {
    const { avatar } = req.body;

    try {
        if (!req.file) {
            res.status(202).json({
                status: 'Not Process',
                message: 'NotFound',
            });

            return;
        }

        const fileName = req.file.filename;
        const ext = path.extname(fileName);

        let pathFile = req.file.path;

        if (ext === '.heic') {
            const convertFile = await convertHEIC(fileName);

            if (!convertFile) {
                const { statusCode, message } =
                    new createHttpError.BadRequest();

                res.status(statusCode).json({ status: 'Not Process', message });

                return;
            }

            pathFile = path.join(pathTemp, convertFile);
        }

        const data = await convertSize(pathFile, avatar ? true : false);

        if (!data) {
            await fs.unlinkSync(pathFile);

            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        res.status(200).json({ status: 'Success', data });
    } catch (error) {
        const { message } = error as Error;

        handleError('API Common Images Upload', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
