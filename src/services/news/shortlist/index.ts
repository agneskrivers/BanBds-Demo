// Configs
import { HomePage } from '@client/configs';

// Interfaces
import type {
    ResJSON,
    IApiWebNewsShortlist,
    IClientServiceNewsShortlist,
} from '@interfaces';

const Index: IClientServiceNewsShortlist = async (page, list, signal) => {
    let uri = `${HomePage}/api-gateway/web/news?page=${page}`;

    if (list) {
        uri += `&list=${JSON.stringify(list)}`;
    }

    try {
        const response = await fetch(uri, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal,
        });
        const result = (await response.json()) as ResJSON<IApiWebNewsShortlist>;

        if (result.status === 'Not Process') return 'BadRequest';

        if (result.status !== 'Success') return null;

        return result.data;
    } catch (_) {
        return null;
    }
};

export default Index;
