import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';

// Configs
import { SecretJWT } from '@server/configs';

// Helpers
import { handleError, jwt } from '@server/helpers';

// Models
import { UsersModel } from '@server/models';

// Interfaces
import type { ResJSON, IApiWebReqLocals, IDataUserToken } from '@interfaces';

// Interface
interface CookieBody {
    user?: string;
}

// Function Type
type ApiWebMiddleware = (
    req: Request<unknown, unknown, unknown, unknown>,
    res: Response<ResJSON, IApiWebReqLocals>,
    next: NextFunction
) => Promise<void>;

const Index: ApiWebMiddleware = async (req, res, next) => {
    try {
        const { user } = req.signedCookies as CookieBody;

        if (!user) {
            const { status, message } = new createHttpError.Unauthorized();

            res.status(status).json({ status: 'Unauthorized', message });

            return;
        }

        const data = await jwt.verify<IDataUserToken>(user, SecretJWT);

        if (!data) {
            const { status, message } = new createHttpError.Unauthorized();

            res.status(status).json({ status: 'Unauthorized', message });

            return;
        }

        const { userID } = data;

        const checkUser = await UsersModel.findOne({ userID });

        if (!checkUser) {
            const { status, message } = new createHttpError.Unauthorized();

            res.status(status).json({ status: 'Unauthorized', message });

            return;
        }

        res.locals = { userID };

        next();
    } catch (error) {
        const { message } = error as Error;

        handleError('API Web Middleware', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
