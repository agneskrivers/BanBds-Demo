// Configs
import { HomePage } from '@client/configs';

// Interfaces
import type {
    IClientServiceDistrict,
    ResJSON,
    IApiWebDistrict,
} from '@interfaces';

const Index: IClientServiceDistrict = async (regionID, district) => {
    const uri = `${HomePage}/api-gateway/web/district?regionID=${regionID}&district=${district}`;

    try {
        const response = await fetch(uri, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = (await response.json()) as ResJSON<IApiWebDistrict>;

        if (result.status !== 'Success') return null;

        return result.data;
    } catch (_) {
        return null;
    }
};

export default Index;
