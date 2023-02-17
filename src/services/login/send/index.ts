// Configs
import { HomePage } from '@client/configs';

// Interfaces
import type { ResJSON, IClientServiceLoginSend } from '@interfaces';

const Index: IClientServiceLoginSend = async (signal, phoneNumber) => {
    const uri = `${HomePage}/api-gateway/web/login/${phoneNumber}`;

    try {
        const response = await fetch(uri, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal,
        });
        const result = (await response.json()) as ResJSON<{ otp: string }>;

        if (result.status === 'Not Process') {
            if (result.message === 'Renew') return 'Failed';

            if (result.message === 'Failed') return 'Failed';

            return 'BadRequest';
        }

        if (result.status !== 'Success') return null;

        return result.data;
    } catch (_) {
        return null;
    }
};

export default Index;
