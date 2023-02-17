import initial from '../initial';

// Enums
import { LengthID } from '@server/enums';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { NewsModel } from '@server/models';

// Interfaces
import type { IServerGenerateID } from '@interfaces';

const Index: IServerGenerateID = async () => {
    try {
        const news = await NewsModel.find();

        if (news.length === 0) return initial(LengthID.user);

        const item = news[news.length - 1].toObject();

        return item.newsID + 1;
    } catch (error) {
        const { message } = error as Error;

        handleError('Server Helper Generate News ID', message);

        return null;
    }
};

export default Index;
