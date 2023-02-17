// Configs
import { HomePage } from '@client/configs';

// Interfaces
import type {
    IApiWebDashboard,
    ResJSON,
    IClientServiceDashboard,
} from '@interfaces';

const Index: IClientServiceDashboard = async () => {
    const uri = `${HomePage}/api-gateway/web/dashboard`;

    try {
        const response = await fetch(uri, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = (await response.json()) as ResJSON<IApiWebDashboard>;

        if (result.status !== 'Success') return null;

        return result.data;
    } catch (_) {
        return null;
    }
};

export default Index;
