// Configs
import { HomePage } from '@client/configs';

// Interfaces
import type {
    ResJSON,
    IClientServicePostDashboard,
    IPostResultGetForDashboardWeb,
} from '@interfaces';

const Index: IClientServicePostDashboard = async (signal, type, page) => {
    const uri = `${HomePage}/api-gateway/web/posts/dashboard?type=${type}&page=${page}`;

    try {
        const response = await fetch(uri, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal,
        });
        const result =
            (await response.json()) as ResJSON<IPostResultGetForDashboardWeb>;

        if (result.status === 'Not Process') return 'BadRequest';

        if (result.status !== 'Success') return null;

        return result.data;
    } catch (_) {
        return null;
    }
};

export default Index;
