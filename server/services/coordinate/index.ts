import fetch from 'node-fetch';
import UserAgent from 'user-agents';

// Helpers
import { handleError } from '@server/helpers';

// Interfaces
import type {
    IServerServiceBatDongSanResult,
    IServerServiceCoordinate,
} from '@interfaces';

const Index: IServerServiceCoordinate = async (
    regionID,
    districtID,
    wardID
) => {
    try {
        const uri = 'https://apimap.batdongsan.com.vn/api/map_sync';
        const body = `cityCode=${regionID}&districtId=${districtID}&streetId&type=getpoint&wardId=${wardID}`;

        const response = await fetch(uri, {
            method: 'POST',
            headers: {
                'User-Agent': new UserAgent().toString(),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body,
        });

        const { Lat, Lng } =
            (await response.json()) as IServerServiceBatDongSanResult;

        if (isNaN(parseFloat(Lat)) || isNaN(parseFloat(Lng))) return null;

        return {
            latitude: parseFloat(Lat),
            longitude: parseFloat(Lng),
        };
    } catch (error) {
        const { message } = error as Error;

        handleError('Server Service Coordinate', message);

        return null;
    }
};

export default Index;
