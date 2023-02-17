// Configs
import { HomePage } from '@client/configs';

// Interfaces
import type {
    ResUploadImageJSON,
    IClientServiceCommonImageUpload,
} from '@interfaces';

const Index: IClientServiceCommonImageUpload = async (signal, body) => {
    const uri = `${HomePage}/api-gateway/common/images`;

    try {
        const response = await fetch(uri, {
            method: 'POST',
            body,
            signal,
        });
        const result = (await response.json()) as ResUploadImageJSON;

        if (result.status === 'ImageFormat') return 'ImageFormat';

        if (result.status === 'ImageToBig') return 'ImageToBig';

        if (result.status === 'Not Process') return 'NotFound';

        if (result.status === 'Unauthorized') return 'Unauthorized';

        if (result.status !== 'Success') return null;

        return { data: result.data };
    } catch (_) {
        return null;
    }
};

export default Index;
