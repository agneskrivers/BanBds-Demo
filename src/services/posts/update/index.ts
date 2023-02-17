// Configs
import { HomePage } from '@client/configs';

// Interfaces
import type { ResJSON, IClientServicePostUpdate } from '@interfaces';

const Index: IClientServicePostUpdate = async (signal, postID, body) => {
    const uri = `${HomePage}/api-gateway/web/posts/${postID}`;

    try {
        const response = await fetch(uri, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            signal,
            body: JSON.stringify(body),
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
