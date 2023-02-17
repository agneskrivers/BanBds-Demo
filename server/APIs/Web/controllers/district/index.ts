import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError, convertToEnglish } from '@server/helpers';

// Models
import { DistrictsModel } from '@server/models';

// Interfaces
import type { ResJSON, IApiWebDistrict } from '@interfaces';

// Request Query
interface ReqQuery {
    regionID: string;
    district: string;
}

// Function Type
type ApiWebDistrict = (
    req: Request<unknown, unknown, unknown, ReqQuery>,
    res: Response<ResJSON<IApiWebDistrict>>
) => Promise<void>;

const Index: ApiWebDistrict = async (req, res) => {
    const { regionID, district } = req.query;

    try {
        const districts = await DistrictsModel.findOne({ regionID });

        if (!districts) {
            const { status, message } = new createHttpError.NotFound();

            res.status(status).json({ status: 'Not Process', message });

            return;
        }

        const findDistrict = [...districts.districts].find(
            (item) =>
                convertToEnglish(item.name).replace(/\s/g, '-') === district
        );

        if (!findDistrict) {
            const { status, message } = new createHttpError.NotFound();

            res.status(status).json({ status: 'Not Process', message });

            return;
        }

        res.status(200).json({
            status: 'Success',
            data: findDistrict,
        });
    } catch (error) {
        const { message } = error as Error;

        handleError('API Web District', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
