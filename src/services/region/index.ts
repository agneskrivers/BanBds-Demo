// Configs
import { HomePage } from '@client/configs';

// Interfaces
import type { ResJSON, IClientServiceRegion, IApiWebRegion } from '@interfaces';

const Index: IClientServiceRegion = async (region) => {
    const uri = `${HomePage}/api-gateway/web/region?region=${region}`;

    try {
        const response = await fetch(uri, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = (await response.json()) as ResJSON<IApiWebRegion>;

        if (result.status !== 'Success') return null;

        return result.data;
    } catch (_) {
        return null;
    }
};

export default Index;
