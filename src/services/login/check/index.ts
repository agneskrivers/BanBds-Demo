// Configs
import { HomePage } from '@client/configs';

// Interfaces
import type { ResJSON, IClientServiceLoginCheck } from '@interfaces';

const Index: IClientServiceLoginCheck = async (signal, phoneNumber, otp) => {
    const uri = `${HomePage}/api-gateway/web/login/${phoneNumber}`;

    try {
        const response = await fetch(uri, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            signal,
            body: JSON.stringify({ otp }),
        });
        const result = (await response.json()) as ResJSON<boolean>;

        if (result.status === 'Not Process') {
            if (result.message === 'Token') return 'Token';

            return 'BadRequest';
        }

        if (result.status !== 'Success') return null;

        return result.data;
    } catch (_) {
        return null;
    }
};

export default Index;
