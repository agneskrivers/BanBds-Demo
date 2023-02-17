// Configs
import { HomePage } from '@client/configs';

// Interfaces
import type {
    ResJSON,
    IApiWebPostShortlist,
    IClientServicePostShortlist,
} from '@interfaces';

const Index: IClientServicePostShortlist = async (
    type,
    page,
    region,
    district,
    project,
    search,
    category,
    pricesMin,
    pricesMax,
    acreagesMin,
    acreagesMax,
    prices,
    acreages,
    createdAt,
    signal
) => {
    let uri = `${HomePage}/api-gateway/web/posts?page=${page}&type=${type}`;

    if (region) {
        uri += `&region=${region}`;
    }

    if (district) {
        uri += `&district=${district}`;
    }

    if (project) {
        uri += `&project=${project}`;
    }

    if (search) {
        uri += `&search=${search}`;
    }

    if (category) {
        uri += `&category=${category}`;
    }

    if (pricesMin !== undefined) {
        uri += `&pricesMin=${pricesMin}`;
    }

    if (pricesMax !== undefined) {
        uri += `&pricesMax=${pricesMax}`;
    }

    if (acreagesMin !== undefined) {
        uri += `&acreagesMin=${acreagesMin}`;
    }

    if (acreagesMax !== undefined) {
        uri += `&acreagesMax=${acreagesMax}`;
    }

    if (prices) {
        uri += `&prices=${prices}`;
    }

    if (acreages) {
        uri += `&acreages=${acreages}`;
    }

    if (createdAt) {
        uri += `&createdAt=${createdAt}`;
    }

    try {
        const response = await fetch(uri, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal,
        });
        const result = (await response.json()) as ResJSON<IApiWebPostShortlist>;

        if (result.status === 'Not Process') return 'BadRequest';

        if (result.status !== 'Success') return null;

        return result.data;
    } catch (_) {
        return null;
    }
};

export default Index;
