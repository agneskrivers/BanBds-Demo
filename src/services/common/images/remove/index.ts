// Configs
import { HomePage } from '@client/configs';

// Interfaces
import type { ResJSON, IClientServiceCommonImageRemove } from '@interfaces';

const Index: IClientServiceCommonImageRemove = async (signal, fileName) => {
    const uri = `${HomePage}/api-gateway/common/images`;

    try {
        const response = await fetch(uri, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            signal,
            body: JSON.stringify({ fileName }),
        });
        const result = (await response.json()) as ResJSON;

        if (!result || result.status !== 'Success') return false;

        return true;
    } catch (_) {
        return false;
    }
};

export default Index;
