// Configs
import { HomePage } from '@client/configs';

// Interfaces
import type { ResJSON, IClientServiceCount } from '@interfaces';

const Index: IClientServiceCount = async (signal, id) => {
    const uri = `${HomePage}/api-gateway/web/projects/${id}/count`;

    try {
        const response = await fetch(uri, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal,
        });
        const result = (await response.json()) as ResJSON;

        if (result.status !== 'Success') return false;

        return true;
    } catch (_) {
        return false;
    }
};

export default Index;
