// Configs
import { HomePage } from '@client/configs';

// Interfaces
import type {
    ResJSON,
    IApiWebProjectShortlist,
    IClientServiceProjectShortlist,
} from '@interfaces';

const Index: IClientServiceProjectShortlist = async (
    page,
    region,
    district,
    search,
    type,
    status,
    pricesMin,
    pricesMax,
    signal
) => {
    let uri = `${HomePage}/api-gateway/web/projects?page=${page}`;

    if (region) {
        uri += `&region=${region}`;
    }

    if (district) {
        uri += `&district=${district}`;
    }

    if (search) {
        uri += `&search=${search}`;
    }

    if (type) {
        uri += `&type=${type}`;
    }

    if (status) {
        uri += `&status=${status}`;
    }

    if (pricesMin !== undefined) {
        uri += `&pricesMin=${pricesMin}`;
    }

    if (pricesMax !== undefined) {
        uri += `&pricesMax=${pricesMax}`;
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
            (await response.json()) as ResJSON<IApiWebProjectShortlist>;

        if (result.status === 'Not Process') return 'BadRequest';

        if (result.status !== 'Success') return null;

        return result.data;
    } catch (_) {
        return null;
    }
};

export default Index;
