import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Models
import { DistrictsModel } from '@server/models';

// Helpers
import { handleError } from '@server/helpers';

// Interfaces
import type { IDistrictInfo, ResJSON } from '@interfaces';

// Request Interface
interface ReqQuery {
    region: string;
}

// Function Type
type ApiCommonAddressDistricts = (
    req: Request<unknown, unknown, unknown, ReqQuery>,
    res: Response<ResJSON<IDistrictInfo[]>>
) => Promise<void>;

const Index: ApiCommonAddressDistricts = async (req, res) => {
    const { region } = req.query;

    try {
        const data = await DistrictsModel.getListByRegionID(region);

        if (!data) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        res.status(200).json({ status: 'Success', data });
    } catch (error) {
        const { message } = error as Error;

        handleError('API Common Address Districts', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
