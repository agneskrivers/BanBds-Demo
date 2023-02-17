// Configs
import { HomePage } from '@client/configs';

// Interfaces
import type {
    ResJSON,
    IApiWebProjectInfo,
    IClientServiceProjectInfo,
} from '@interfaces';

const Index: IClientServiceProjectInfo = async (projectID) => {
    const uri = `${HomePage}/api-gateway/web/projects/${projectID}`;

    try {
        const response = await fetch(uri, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = (await response.json()) as ResJSON<IApiWebProjectInfo>;

        if (result.status === 'Not Process') return 'NotFound';

        if (result.status !== 'Success') return null;

        return result.data;
    } catch (_) {
        return null;
    }
};

export default Index;
