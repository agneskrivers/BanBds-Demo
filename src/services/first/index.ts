// Configs
import { HomePage } from '@client/configs';

// Interfaces
import type { IClientServiceFirst, ResJSON, IApiWebFirst } from '@interfaces';

const Index: IClientServiceFirst = async (signal) => {
    const uri = `${HomePage}/api-gateway/web`;

    try {
        const response = await fetch(uri, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal,
        });
        const result = (await response.json()) as ResJSON<IApiWebFirst>;

        if (result.status !== 'Success') throw new Error();

        return result.data;
    } catch (error) {
        return {
            mode: 'notLogin',
            regions: [],
        };
    }
};

export default Index;
