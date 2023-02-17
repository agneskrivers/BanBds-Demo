import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import fs from 'fs';
import path from 'path';

// Configs
import { VersionDefault, pathData } from '@server/configs';

// Helpers
import { handleError } from '@server/helpers';

// Interfaces
import type { ResJSON, IVersionJSON } from '@interfaces';

// Function Type
type ApiAppVersionLink = (
    req: Request,
    res: Response<ResJSON<Pick<IVersionJSON, 'appStore' | 'playStore'>>>
) => Promise<void>;

const Index: ApiAppVersionLink = async (_, res) => {
    try {
        const pathVersion = path.join(pathData, 'version.json');

        let version: IVersionJSON = VersionDefault;

        if (fs.existsSync(pathVersion)) {
            const dataVersion = await fs.readFileSync(pathVersion, {
                encoding: 'utf8',
            });

            version = JSON.parse(dataVersion) as IVersionJSON;
        } else {
            await fs.writeFileSync(pathVersion, JSON.stringify(VersionDefault));
        }

        res.status(200).json({
            status: 'Success',
            data: { appStore: version.appStore, playStore: version.playStore },
        });
    } catch (error) {
        const { message } = error as Error;

        handleError('API App Version Link', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
