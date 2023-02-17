// Configs
import { HomePage } from '@client/configs';

// Interfaces
import type {
    ResJSON,
    IDistrictInfo,
    IClientServiceCommonAddressDistricts,
} from '@interfaces';

const Index: IClientServiceCommonAddressDistricts = async (
    signal,
    regionID
) => {
    const uri = `${HomePage}/api-gateway/common/districts?region=${regionID}`;

    try {
        const response = await fetch(uri, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal,
        });
        const result = (await response.json()) as ResJSON<IDistrictInfo[]>;

        if (!result) return null;

        if (result.status === 'Not Process') return 'BadRequest';

        if (result.status !== 'Success') return null;

        return result.data;
    } catch (_) {
        return null;
    }
};

export default Index;
