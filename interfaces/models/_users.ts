// Type
type UserInfoForAdmin = Omit<IUserInfoForUser, 'posts'>;

// Interfaces
interface UserInfoCount {
    pending: number;
    accept: number;
}

// Export Type
export type IUserCreate = Pick<
    IUser,
    'address' | 'avatar' | 'birthday' | 'fullName' | 'phoneNumber'
>;
export type IUserInfoForUser = Pick<
    IUser,
    'address' | 'avatar' | 'birthday' | 'fullName' | 'posts' | 'phoneNumber'
>;
export type IUserUpdateInfo = Partial<Omit<IUserCreate, 'phoneNumber'>>;

// Export Interfaces
export interface IUser {
    userID: number;
    avatar: string | null;
    fullName: string;
    phoneNumber: string;
    address: string;
    birthday: number;
    posts: UserInfoCount;
    requests: UserInfoCount;
    isBanned: boolean;
    bannedAt: number | null;
    bannedRequester: string | null;
}
export interface IUserInfoForAdmin extends UserInfoForAdmin {
    posts: number;
    requests: number;
}
