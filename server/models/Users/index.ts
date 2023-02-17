import { model, Model, Schema, Document } from 'mongoose';

// Configs
import { SecretJWT } from '@server/configs';

// Enums
import { TokenExpired } from '@server/enums';

// Helpers
import { handleError, jwt, generateID } from '@server/helpers';

// Models
import { ImagesModel } from '@server/models';

// Interfaces
import type {
    IUser,
    IUserCreate,
    IDataUserToken,
    IDeviceType,
    IRequestStatus,
    IUserInfoForAdmin,
    IUserInfoForUser,
    IUserUpdateInfo,
    IImage,
} from '@interfaces';

// Methods Interface
interface UserMethods extends Document, IUser {
    generateToken(type: IDeviceType): Promise<string | null>;
    addRequest(status: IRequestStatus): Promise<boolean>;
    addPost(status: IRequestStatus): Promise<boolean>;
    removeRequest(status: IRequestStatus): Promise<boolean>;
    removePost(status: IRequestStatus): Promise<boolean>;
    updateInfo(data: IUserUpdateInfo): Promise<boolean>;
}

// Model Interface
interface UserModel extends Model<IUser, Record<string, string>, UserMethods> {
    createUser(user: IUserCreate, type: IDeviceType): Promise<string | null>;
    checkToken(token: string): Promise<number | null>;
    getInfoForUser(userID: number): Promise<IUserInfoForUser | null>;
    getInfoForAdmin(userID: number): Promise<IUserInfoForAdmin | null>;
}

// Schema
const UserSchema = new Schema<IUser, UserModel, UserMethods>(
    {
        userID: { type: Number, required: true, immutable: true, unique: true },
        phoneNumber: {
            type: String,
            required: true,
            immutable: true,
            unique: true,
        },
        fullName: { type: String, required: true },
        birthday: { type: Number, required: true },
        address: { type: String, required: true },

        avatar: { type: String, default: null },
        posts: {
            accept: { type: Number, default: 0 },
            pending: { type: Number, default: 0 },
        },
        requests: {
            accept: { type: Number, default: 0 },
            pending: { type: Number, default: 0 },
        },
        isBanned: { type: Boolean, default: false },
        bannedAt: { type: Number, default: null },
        bannedRequester: { type: String, default: null },
    },
    {
        timestamps: true,
    }
);

// Statics
UserSchema.statics.createUser = async function (
    user: IUserCreate,
    type: IDeviceType
): Promise<string | null> {
    let userID: number | null = null;

    try {
        const checkUser = await this.findOne({ phoneNumber: user.phoneNumber });

        if (checkUser) {
            userID = checkUser.userID;
        } else {
            userID = await generateID.user();

            if (!userID) return null;

            let avatar: string | null = null;

            if (user.avatar) {
                const image: IImage = {
                    fileName: user.avatar,
                    userID,
                };

                const isCreateImg = await ImagesModel.createImg(
                    image,
                    'avatars'
                );

                if (isCreateImg) {
                    avatar = user.avatar;
                }
            }

            const userNew = new this({
                ...user,
                userID,
                avatar,
            });

            await userNew.save();
        }

        const data: IDataUserToken = {
            userID,
            timestamp: Date.now(),
        };

        const token = await jwt.generate<IDataUserToken>(
            data,
            SecretJWT,
            TokenExpired[type]
        );

        return token;
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Users Static Create', message);

        return null;
    }
};
UserSchema.statics.checkToken = async function (
    token: string
): Promise<number | null> {
    try {
        const verify = await jwt.verify<IDataUserToken>(token, SecretJWT);

        if (!verify) return null;

        const { userID } = verify;

        const user = await this.findOne({ userID });

        if (!user) return null;

        return userID;
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Users Static Check Token', message);

        return null;
    }
};
UserSchema.statics.getInfoForUser = async function (
    userID: number
): Promise<IUserInfoForUser | null> {
    try {
        const user = await this.findOne(
            { userID },
            { projection: { _id: 0 } }
        ).select('address avatar birthday fullName posts phoneNumber');

        if (!user) return null;

        return user.toObject();
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Users Static Get Info For User', message);

        return null;
    }
};
UserSchema.statics.getInfoForAdmin = async function (
    userID: number
): Promise<IUserInfoForAdmin | null> {
    try {
        const user = await this.findOne(
            { userID },
            { projection: { _id: 0 } }
        ).select('address avatar birthday fullName posts phoneNumber requests');

        if (!user) return null;

        const { requests, posts, ...result } = user.toObject();

        return {
            ...result,
            requests: requests.accept + requests.pending,
            posts: posts.accept + posts.pending,
        };
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Users Static Get Info For Admin', message);

        return null;
    }
};

// Methods
UserSchema.methods.generateToken = async function (type) {
    try {
        const { userID } = this;

        const data: IDataUserToken = {
            userID,
            timestamp: Date.now(),
        };

        const token = await jwt.generate<IDataUserToken>(
            data,
            SecretJWT,
            TokenExpired[type]
        );

        return token;
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Users Method Generate Token', message);

        return null;
    }
};
UserSchema.methods.addRequest = async function (status) {
    try {
        if (status === 'pending') {
            const updateRequestPending = this.requests.pending + 1;

            this.requests.pending = updateRequestPending;
        } else {
            const updateRequestPending = this.requests.pending - 1;
            const updateRequestAccept = this.requests.accept + 1;

            this.requests.accept = updateRequestAccept;
            this.requests.pending = updateRequestPending;
        }

        await this.save();

        return true;
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Users Method Add Request', message);

        return false;
    }
};
UserSchema.methods.addPost = async function (status) {
    try {
        if (status === 'pending') {
            const updatePostPending = this.post.pending + 1;

            this.post.pending = updatePostPending;
        } else {
            const updatePostPending = this.post.pending - 1;
            const updatePostAccept = this.post.accept + 1;

            this.post.accept = updatePostAccept;
            this.post.pending = updatePostPending;
        }

        await this.save();

        return true;
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Users Method Add Post', message);

        return false;
    }
};
UserSchema.methods.removePost = async function (status) {
    try {
        if (status === 'accept') {
            const updatePostAccept = this.posts.accept - 1;

            this.posts.accept = updatePostAccept;
        } else {
            const updatePostPending = this.posts.pending - 1;

            this.posts.pending = updatePostPending;
        }

        await this.save();

        return true;
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Users Method Remove Post', message);

        return false;
    }
};
UserSchema.methods.removeRequest = async function (status) {
    try {
        if (status === 'accept') {
            const updateRequestsAccept = this.requests.accept - 1;

            this.requests.accept = updateRequestsAccept;
        } else {
            const updateRequestsPending = this.requests.pending - 1;

            this.requests.pending = updateRequestsPending;
        }

        await this.save();

        return true;
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Users Method Remove Request', message);

        return false;
    }
};
UserSchema.methods.updateInfo = async function (data) {
    try {
        const { address, avatar, birthday, fullName } = data;

        if (address) {
            this.address = address;
        }

        if (avatar) {
            const image: IImage = {
                fileName: avatar,
                userID: this.userID,
            };

            const isCreateAvatarNew = await ImagesModel.createImg(
                image,
                'avatars'
            );

            if (isCreateAvatarNew) {
                const avatarOld = this.avatar;

                if (avatarOld) {
                    await ImagesModel.removeImg(
                        avatarOld,
                        this.userID,
                        'avatars'
                    );
                }

                this.avatar = avatar;
            }
        }

        if (birthday) {
            this.birthday = birthday;
        }

        if (fullName) {
            this.fullName = fullName;
        }

        await this.save();

        return true;
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Users Method Update Info', message);

        return false;
    }
};

// Models
const Index = model<IUser, UserModel>('Users', UserSchema);

export default Index;
