import fetch from 'node-fetch';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { RegionsModel, DistrictsModel, WardsModel } from '@server/models';

// Interfaces
import type { IDistrictInfo, IWardInfo } from '@interfaces';

// Interface
interface ResJSON<T = string | number> {
    Result: [
        {
            id: T;
            name: string;
        }
    ];
}

// Constants
const uriRegions =
    'https://sellernetapi.batdongsan.com.vn/api/common/fetchCityList';
const uriDistricts =
    'https://sellernetapi.batdongsan.com.vn/api/common/fetchDistrictList?cityCode=';
const uriWards =
    'https://sellernetapi.batdongsan.com.vn/api/common/fetchWardList?districtId=';
const headers = {
    apiversion: '2020-02-28 18:30',
    auth: '1',
    'Content-Type': 'application/json',
};

const Index = async () => {
    try {
        const checkRegions = await RegionsModel.find();
        const checkDistricts = await DistrictsModel.find();
        const checkWards = await WardsModel.find();

        if (
            checkRegions.length === 63 &&
            checkDistricts.length > 0 &&
            checkWards.length > 0
        ) {
            console.log('Address already set!');

            return;
        }

        console.log('Setup Address...');

        if (checkRegions.length > 0) {
            await RegionsModel.collection.drop();
        }
        if (checkDistricts.length > 0) {
            await DistrictsModel.collection.drop();
        }
        if (checkWards.length > 0) {
            await WardsModel.collection.drop();
        }

        const responseGetRegions = await fetch(uriRegions, {
            method: 'GET',
            headers,
        });
        const { Result: resultGetRegions } =
            (await responseGetRegions.json()) as ResJSON<string>;

        for (let i = 0; i < resultGetRegions.length; i++) {
            const { id: regionID, name: regionName } = resultGetRegions[i];

            const newRegion = new RegionsModel({
                regionID,
                name: regionName,
            });

            await newRegion.save();

            const uriGetDistrict = uriDistricts + regionID;

            const responseGetDistrict = await fetch(uriGetDistrict, {
                method: 'GET',
                headers,
            });

            const { Result: resultGetDistricts } =
                (await responseGetDistrict.json()) as ResJSON<number>;

            const districts: IDistrictInfo[] = [...resultGetDistricts].map(
                ({ id, name }) => ({ districtID: id.toString(), name })
            );

            const newDistrict = new DistrictsModel({
                regionID,
                districts,
            });

            await newDistrict.save();

            for (let j = 0; j < districts.length; j++) {
                const { districtID } = districts[j];

                const uriGetWards = uriWards + districtID;

                const responseGetWards = await fetch(uriGetWards, {
                    method: 'GET',
                    headers,
                });

                const { Result: resultGetWards } =
                    (await responseGetWards.json()) as ResJSON<number>;

                const wards: IWardInfo[] = [...resultGetWards].map(
                    ({ id, name }) => ({ wardID: id.toString(), name })
                );

                const newWard = new WardsModel({
                    districtID,
                    wards,
                });

                await newWard.save();
            }
        }

        console.log('Setup Address Success!');
    } catch (error) {
        const { message } = error as Error;

        handleError('Setup Address', message);
    }
};

export default Index;
