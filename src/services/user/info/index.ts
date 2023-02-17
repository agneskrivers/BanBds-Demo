// Configs
import { HomePage } from '@client/configs';

// Interfaces
import type {
    ResJSON,
    IClientServiceUserInfo,
    IUserInfoForUser,
} from '@interfaces';

const Index: IClientServiceUserInfo = async (signal) => {
    const uri = `${HomePage}/api-gateway/web/user`;

    try {
        const response = await fetch(uri, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal,
        });
        const result = (await response.json()) as ResJSON<IUserInfoForUser>;

        if (result.status === 'Not Process') return 'BadRequest';

        if (result.status === 'Unauthorized') return 'Unauthorized';

        if (result.status !== 'Success') return null;

        return result.data;
    } catch (_) {
        return null;
    }
};

export default Index;
