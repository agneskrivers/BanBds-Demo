import initial from '../initial';

// Enums
import { LengthID } from '@server/enums';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { UsersModel } from '@server/models';

// Interfaces
import type { IServerGenerateID } from '@interfaces';

const Index: IServerGenerateID = async () => {
    try {
        const users = await UsersModel.find();

        if (users.length === 0) return initial(LengthID.user);

        const user = users[users.length - 1].toObject();

        return user.userID + 1;
    } catch (error) {
        const { message } = error as Error;

        handleError('Server Helper Generate User ID', message);

        return null;
    }
};

export default Index;
