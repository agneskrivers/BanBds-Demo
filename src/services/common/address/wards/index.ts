// Configs
import { HomePage } from '@client/configs';

// Interfaces
import type {
    ResJSON,
    IWardInfo,
    IClientServiceCommonAddressWards,
} from '@interfaces';

const Index: IClientServiceCommonAddressWards = async (signal, districtID) => {
    const uri = `${HomePage}/api-gateway/common/wards?district=${districtID}`;

    try {
        const response = await fetch(uri, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal,
        });
        const result = (await response.json()) as ResJSON<IWardInfo[]>;

        if (!result) return null;

        if (result.status === 'Not Process') return 'BadRequest';

        if (result.status !== 'Success') return null;

        return result.data;
    } catch (_) {
        return null;
    }
};

export default Index;
