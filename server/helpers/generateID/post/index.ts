import initial from '../initial';

// Enums
import { LengthID } from '@server/enums';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { PostsModel } from '@server/models';

// Interfaces
import type { IServerGenerateID } from '@interfaces';

const Index: IServerGenerateID = async () => {
    try {
        const posts = await PostsModel.find();

        if (posts.length === 0) return initial(LengthID.post);

        const post = posts[posts.length - 1].toObject();

        return post.postID + 1;
    } catch (error) {
        const { message } = error as Error;

        handleError('Server Helper Generate Post ID', message);

        return null;
    }
};

export default Index;
