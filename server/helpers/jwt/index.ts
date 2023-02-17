import jwt from 'jsonwebtoken';

// Interfaces
import type { IServerJwtGenerate, IServerJwtVerify } from '@interfaces';

const generate: IServerJwtGenerate = (data, secret, expired) =>
    new Promise((resolve) => {
        jwt.sign(
            {
                data,
            },
            secret,
            {
                algorithm: 'HS512',
                expiresIn: expired,
            },
            (_, encoded) => {
                if (encoded) return resolve(encoded);

                resolve(null);
            }
        );
    });

const verify: IServerJwtVerify = (token, secret) =>
    new Promise((resolve) => {
        jwt.verify(token, secret, (_, decoded) => {
            if (decoded && typeof decoded !== 'string')
                return resolve(decoded.data);

            resolve(null);
        });
    });

export default { generate, verify };
