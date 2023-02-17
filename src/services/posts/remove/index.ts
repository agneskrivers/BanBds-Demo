// Configs
import { HomePage } from '@client/configs';

// Interfaces
import type { ResJSON, IClientServicePostRemove } from '@interfaces';

const Index: IClientServicePostRemove = async (signal, postID) => {
    const uri = `${HomePage}/api-gateway/web/posts/${postID}`;

    try {
        const response = await fetch(uri, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            signal,
        });
        const result = (await response.json()) as ResJSON;

        if (result.status === 'Not Process') return 'NotFound';

        if (result.status === 'Unauthorized') return 'Unauthorized';

        if (result.status !== 'Success') return false;

        return true;
    } catch (_) {
        return false;
    }
};

export default Index;
