import fetch from 'node-fetch';

// Configs
import { ESmsApiKey, ESmsCodeResponse, ESmsSecretKey } from '@server/configs';

// Helpers
import { handleError } from '@server/helpers';

// Interfaces
import type {
    IServerServiceESmsReqBody,
    IServerServiceESmsResult,
    IServerServiceSMS,
} from '@interfaces';

const Index: IServerServiceSMS = async (phoneNumber, otp) => {
    const uri =
        'http://rest.esms.vn/MainService.svc/json/SendMultipleMessage_V4_post_json/';

    try {
        if (process.env.NODE_ENV === 'production') {
            const body: IServerServiceESmsReqBody = {
                ApiKey: ESmsApiKey,
                SecretKey: ESmsSecretKey,
                Phone: phoneNumber,
                Content: otp,
                SmsType: 8,
            };

            const response = await fetch(uri, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            const { CodeResult } =
                (await response.json()) as IServerServiceESmsResult;

            if (isNaN(parseInt(CodeResult))) return false;

            if (parseInt(CodeResult) !== 100)
                throw new Error(ESmsCodeResponse[CodeResult]);
        } else {
            console.log(otp);
        }

        return true;
    } catch (error) {
        const { message } = error as Error;

        handleError('Server Service SMS', message);

        return false;
    }
};

export default Index;
