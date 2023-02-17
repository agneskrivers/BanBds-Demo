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
type ApiAppVersionCheck = (
    req: Request,
    res: Response<ResJSON>
) => Promise<void>;

const Index: ApiAppVersionCheck = async (req, res) => {
    const ver = req.headers['x-banbds-version'];

    try {
        if (!ver || typeof ver !== 'string') {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

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

        if (version.ver > ver) {
            if (version.mandatory) {
                res.status(202).json({
                    status: 'Not Process',
                    message: 'Mandatory',
                });

                return;
            }

            res.status(202).json({ status: 'Not Process', message: 'Update' });

            return;
        }

        res.status(200).json({ status: 'Success' });
    } catch (error) {
        const { message } = error as Error;

        handleError('API App Version Check', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
