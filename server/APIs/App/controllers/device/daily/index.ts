import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import path from 'path';
import fs from 'fs';

// Configs
import { LinkDefault, pathData, pathJS } from '@server/configs';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { RegionsModel } from '@server/models';

// Interfaces
import type { ResJSON, IApiAppDeviceDaily, ILinkJSON } from '@interfaces';

// Function Type
type ApiAppDeviceDaily = (
    req: Request,
    res: Response<ResJSON<IApiAppDeviceDaily>>
) => Promise<void>;

const Index: ApiAppDeviceDaily = async (_, res) => {
    try {
        const regions = await RegionsModel.getShortlist();

        if (!regions) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        const pathLink = path.join(pathData, 'links.json');
        const pathRemaps = path.join(pathJS, 'remaps.js');

        let link = LinkDefault;
        let remaps = '';

        if (fs.existsSync(pathLink)) {
            const dataLink = await fs.readFileSync(pathLink, {
                encoding: 'utf8',
            });

            link = JSON.parse(dataLink) as ILinkJSON;
        } else {
            await fs.writeFileSync(pathLink, JSON.stringify(LinkDefault));
        }

        if (fs.existsSync(pathJS)) {
            remaps = await fs.readFileSync(pathRemaps, { encoding: 'utf8' });
        }

        const data: IApiAppDeviceDaily = { link, regions, remaps };

        res.status(200).json({ status: 'Success', data });
    } catch (error) {
        const { message } = error as Error;

        handleError('API App Device Daily', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
