// Helpers
import { handleError } from '@server/helpers';

// Models
import { RegionsModel, DistrictsModel, WardsModel } from '@server/models';

// Interfaces
import type { IServerGetAddress } from '@interfaces';

const Index: IServerGetAddress = async (
    regionID,
    districtID,
    wardID,
    address
) => {
    const validAddress = address ? `${address}, ` : '';

    try {
        const region = await RegionsModel.getName(regionID);
        const district = await DistrictsModel.getName(regionID, districtID);

        if (!region || !district) return null;

        if (wardID === 'all') return `${validAddress}${district}, ${region}`;

        const ward = await WardsModel.getName(districtID, wardID);

        if (!ward) return null;

        return `${validAddress}${ward}, ${district}, ${region}`;
    } catch (error) {
        const { message } = error as Error;

        handleError('Server Helper Get Address', message);

        return null;
    }
};

export default Index;
