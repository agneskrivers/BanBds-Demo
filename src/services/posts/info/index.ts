// Configs
import { HomePage } from '@client/configs';

// Interfaces
import type {
    ResJSON,
    IPostInfoForWeb,
    IClientServicePostInfo,
} from '@interfaces';

const Index: IClientServicePostInfo = async (postID) => {
    const uri = `${HomePage}/api-gateway/web/posts/info/${postID}`;

    try {
        const response = await fetch(uri, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = (await response.json()) as ResJSON<IPostInfoForWeb>;

        if (result.status === 'Not Process') return 'NotFound';

        if (result.status !== 'Success') return null;

        return result.data;
    } catch (_) {
        return null;
    }
};

export default Index;
