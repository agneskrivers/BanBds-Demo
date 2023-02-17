import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import createHttpError from 'http-errors';

// Configs
import { pathJS, LinkDefault, pathData } from '@server/configs';

// Helpers
import { handleError } from '@server/helpers';

// Models
import {
    RegionsModel,
    DevicesModel,
    DistrictsModel,
    WardsModel,
} from '@server/models';

// Interfaces
import type {
    ILinkJSON,
    ResJSON,
    IDeviceCreate,
    IApiAppInitResult,
} from '@interfaces';

// Function Type
type ApiAppInit = (
    req: Request<unknown, unknown, IDeviceCreate>,
    res: Response<ResJSON<IApiAppInitResult>>
) => Promise<void>;

const Index: ApiAppInit = async (req, res) => {
    try {
        const device = await DevicesModel.createDevice(req.body);

        if (!device) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        const regions = await RegionsModel.getShortlist();

        if (!regions) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        const districts = await DistrictsModel.getList();

        if (!districts) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        const wards = await WardsModel.getList();

        if (!wards) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        const pathLink = path.join(pathData, 'links.json');
        const pathRemaps = path.join(pathJS, 'remaps.js');

        let link: ILinkJSON = LinkDefault;
        let remaps = '';

        if (fs.existsSync(pathLink)) {
            const dataLink = await fs.readFileSync(pathLink, {
                encoding: 'utf8',
            });

            link = JSON.parse(dataLink) as ILinkJSON;
        } else {
            if (!fs.existsSync(pathData)) {
                fs.mkdirSync(pathData);
            }

            await fs.writeFileSync(pathLink, JSON.stringify(LinkDefault));
        }

        if (fs.existsSync(pathRemaps)) {
            remaps = fs.readFileSync(pathRemaps, { encoding: 'utf8' });
        }

        const data: IApiAppInitResult = {
            districts,
            link,
            regions,
            remaps,
            wards,
            deviceID: device.deviceID,
            token: device.token,
        };

        res.status(200).json({ status: 'Success', data });
    } catch (error) {
        const { message } = error as Error;

        handleError('API App Init', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
