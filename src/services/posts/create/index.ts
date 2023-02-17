// Configs
import { HomePage } from '@client/configs';

// Interfaces
import type { ResJSON, IClientServicePostCreate } from '@interfaces';

const Index: IClientServicePostCreate = async (signal, body) => {
    const uri = `${HomePage}/api-gateway/web/posts`;

    try {
        const response = await fetch(uri, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            signal,
            body: JSON.stringify(body),
        });
        const result = (await response.json()) as ResJSON;

        if (result.status === 'Unauthorized') return 'Unauthorized';

        if (result.status === 'Not Process') return 'BadRequest';

        if (result.status !== 'Success') return false;

        return true;
    } catch (_) {
        return false;
    }
};

export default Index;
