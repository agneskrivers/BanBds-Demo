// Configs
import { HomePage } from '@client/configs';

// Interfaces
import type {
    ResJSON,
    IApiWebNewsInfo,
    IClientServiceNewsInfo,
} from '@interfaces';

const Index: IClientServiceNewsInfo = async (newsID) => {
    const uri = `${HomePage}/api-gateway/web/news/${newsID}`;

    try {
        const response = await fetch(uri, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = (await response.json()) as ResJSON<IApiWebNewsInfo>;

        if (result.status === 'Not Process') return 'NotFound';

        if (result.status !== 'Success') return null;

        return result.data;
    } catch (_) {
        return null;
    }
};

export default Index;
