import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Models
import { WardsModel } from '@server/models';

// Helpers
import { handleError } from '@server/helpers';

// Interfaces
import type { IWardInfo, ResJSON } from '@interfaces';

// Request Interface
interface ReqQuery {
    district: string;
}

// Function Type
type ApiCommonAddressWards = (
    req: Request<unknown, unknown, unknown, ReqQuery>,
    res: Response<ResJSON<IWardInfo[]>>
) => Promise<void>;

const Index: ApiCommonAddressWards = async (req, res) => {
    const { district } = req.query;

    try {
        const data = await WardsModel.getListByDistrictID(district);

        if (!data) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        res.status(200).json({ status: 'Success', data });
    } catch (error) {
        const { message } = error as Error;

        handleError('API Common Address Wards', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
