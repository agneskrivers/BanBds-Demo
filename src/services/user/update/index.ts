// Configs
import { HomePage } from '@client/configs';

// Interfaces
import type { ResJSON, IClientServiceUserUpdate } from '@interfaces';

const Index: IClientServiceUserUpdate = async (signal, body) => {
    const uri = `${HomePage}/api-gateway/web/user`;

    try {
        const response = await fetch(uri, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            signal,
            body: JSON.stringify(body),
        });
        const result = (await response.json()) as ResJSON;

        if (result.status === 'Not Process') return 'BadRequest';

        if (result.status === 'Unauthorized') return 'Unauthorized';

        if (result.status !== 'Success') return false;

        return true;
    } catch (_) {
        return false;
    }
};

export default Index;
