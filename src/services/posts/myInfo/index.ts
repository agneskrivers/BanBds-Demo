// Configs
import { HomePage } from '@client/configs';

// Interfaces
import type {
    ResJSON,
    IMyPostInfo,
    IClientServiceMyPostInfo,
} from '@interfaces';

const Index: IClientServiceMyPostInfo = async (signal, postID) => {
    const uri = `${HomePage}/api-gateway/web/posts/info/${postID}/my`;

    try {
        const response = await fetch(uri, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal,
        });
        const result = (await response.json()) as ResJSON<IMyPostInfo>;

        if (result.status === 'Unauthorized') return 'Unauthorized';

        if (result.status === 'Not Process') return 'NotFound';

        if (result.status !== 'Success') return null;

        return result.data;
    } catch (_) {
        return null;
    }
};

export default Index;
