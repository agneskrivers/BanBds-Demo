import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Configs
import { SecretJWT } from '@server/configs';

// Helpers
import { handleError, jwt } from '@server/helpers';

// Models
import { RegionsModel, UsersModel } from '@server/models';

// Interfaces
import type { ResJSON, IApiWebFirst, IDataUserToken } from '@interfaces';

// Function Type
type ApiWebFirst = (
    req: Request,
    res: Response<ResJSON<IApiWebFirst>>
) => Promise<void>;

const Index: ApiWebFirst = async (req, res) => {
    try {
        const regions = await RegionsModel.getListSelect();

        const token = req.signedCookies.user as string | undefined;

        if (token) {
            const resultToken = await jwt.verify<IDataUserToken>(
                token,
                SecretJWT
            );

            if (resultToken) {
                const { userID } = resultToken;

                const user = await UsersModel.getInfoForUser(userID);

                if (user) {
                    res.status(200).json({
                        status: 'Success',
                        data: {
                            mode: 'login',
                            regions: regions ? regions : [],
                            user,
                        },
                    });

                    return;
                }
            }
        }

        res.status(200).json({
            status: 'Success',
            data: { mode: 'notLogin', regions: regions ? regions : [] },
        });
    } catch (error) {
        const { message } = error as Error;

        handleError('API Web First', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
