// Configs
import { HomePage } from '@client/configs';

// Interfaces
import type {
    ResJSON,
    IApiWebPostMyShortlist,
    IClientServicePostMyShortlist,
} from '@interfaces';

const Index: IClientServicePostMyShortlist = async (signal, page, status) => {
    let uri = `${HomePage}/api-gateway/web/posts/my?page=${page}`;

    if (status) {
        uri += `&status=${status}`;
    }

    try {
        const response = await fetch(uri, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal,
        });
        const result =
            (await response.json()) as ResJSON<IApiWebPostMyShortlist>;

        if (result.status === 'Not Process') return 'NotFound';

        if (result.status === 'Unauthorized') return 'Unauthorized';

        if (result.status !== 'Success') return null;

        return result.data;
    } catch (_) {
        return null;
    }
};

export default Index;
