import { model, Model, Schema, Document } from 'mongoose';
import getVideoId from 'get-video-id';

// Helpers
import {
    handleError,
    generateID,
    getAddress,
    getPages,
    getLink,
} from '@server/helpers';

// Models
import {
    UsersModel,
    ImagesModel,
    BrokersModel,
    RegionsModel,
    DistrictsModel,
} from '@server/models';

// Services
import services from '@server/services';

// Interfaces
import type {
    IPost,
    IPostCreate,
    IPostLocation,
    IPostCompactForApp,
    IPostType,
    IPostSort,
    IPostFilter,
    IPostInfoForApp,
    IPostInfoForWeb,
    IPostStatus,
    IMyPostInfo,
    IImage,
    IPostUpdateForUser,
    IResultGetShortlistForWeb,
    IPostCompactForWeb,
    IApiWebPostMyShortlist,
    IPostCompactModeEditorForWeb,
    IPostResultGetForDashboardWeb,
    IPostCompactForWebDashboard,
    IPostTotalsByAreaDashboardWeb,
    IPostCompactModeVerticalForWeb,
    IPostResultGetForNews,
    ITotalsByAreas,
} from '@interfaces';

// Type
type ResultGetMyShortlistForApp = Omit<ResultGetShortlistForApp, 'totals'>;

// Interface
interface ResultGetShortlistForApp {
    totals: number;
    pages: number;
    posts: IPostCompactForApp[];
}
interface ResultUpdateByUser {
    create: string[];
    remove: string[];
}

// Methods Interface
interface PostMethods extends Document, IPost {
    updateByUser(
        data: IPostUpdateForUser
    ): Promise<boolean | ResultUpdateByUser>;
    removePost(): Promise<boolean>;
    sold(): Promise<boolean>;
}

// Model Interface
interface PostModel extends Model<IPost, Record<string, string>, PostMethods> {
    createPost(userID: number, data: IPostCreate): Promise<number | null>;
    countViews(postID: number): Promise<boolean>;

    getShortlistForApp(
        page: number,
        type: IPostType,
        region?: string,
        district?: string,
        search?: string,
        filter?: IPostFilter,
        sort?: IPostSort
    ): Promise<ResultGetShortlistForApp | null>;
    getShortlistForWeb(
        page: number,
        type: IPostType,
        region?: string,
        district?: string,
        search?: string,
        project?: string,
        filter?: IPostFilter,
        sort?: IPostSort
    ): Promise<IResultGetShortlistForWeb | null>;

    getMyShortlistForApp(
        page: number,
        userID: number,
        type: IPostType,
        status: Exclude<IPostStatus, 'sold'>
    ): Promise<ResultGetMyShortlistForApp | null>;
    getMyShortlistForWeb(
        page: number,
        userID: number,
        status?: IPostStatus
    ): Promise<IApiWebPostMyShortlist | null>;

    getMyPostInfo(postID: number, userID: number): Promise<IMyPostInfo | null>;

    getInfoForApp(postID: number): Promise<IPostInfoForApp | null>;
    getInfoForWeb(postID: number): Promise<IPostInfoForWeb | null>;

    getForDashboardWeb(
        type: IPostType,
        page: number
    ): Promise<IPostResultGetForDashboardWeb | null>;
    getForProject(
        project: string
    ): Promise<IPostCompactModeVerticalForWeb[] | null>;
    getForNews(): Promise<IPostResultGetForNews | null>;

    getTotalsByAreasForDashboardWeb(): Promise<IPostTotalsByAreaDashboardWeb | null>;

    getTotalsByAreas(
        type: IPostType,
        id?: string
    ): Promise<ITotalsByAreas[] | null>;
}

// Schema
const PostSchema = new Schema<IPost, PostModel, PostMethods>(
    {
        postID: { type: Number, required: true, immutable: true, unique: true },
        userID: { type: Number, required: true, immutable: true },
        status: {
            type: String,
            enum: ['pending', 'accept', 'sold'],
            default: 'pending',
        },
        title: { type: String, required: true },
        content: { type: String, required: true },
        location: {
            type: {
                region: { type: String, required: true },
                district: { type: String, required: true },
                ward: { type: String, required: true },
                address: { type: String, required: true },
                coordinate: {
                    type: {
                        latitude: { type: Number, required: true },
                        longitude: { type: Number, required: true },
                    },
                    required: true,
                },
            },
            required: true,
        },
        acreages: { type: Number, required: true },
        prices: { type: Number, required: true },
        category: {
            type: String,
            enum: ['apartment', 'house', 'soil'],
            required: true,
        },
        type: { type: String, enum: ['sell', 'rent'], required: true },
        project: { type: String, default: null },
        poster: {
            type: {
                name: { type: String, required: true },
                phoneNumber: { type: [String], required: true },
            },
            required: true,
        },
        broker: {
            type: String,
            default: null,
        },
        direction: {
            type: String,
            default: null,
        },
        legal: {
            type: String,
            default: null,
        },
        facades: { type: Number, default: null },
        ways: { type: Number, default: null },
        video: { type: String, default: null },
        images: { type: [String], required: true },
        views: { type: Number, default: 0 },
        editor: { type: String, default: null },
    },
    {
        timestamps: true,
    }
);

// Statics
PostSchema.statics.createPost = async function (
    userID: number,
    data: IPostCreate
): Promise<number | null> {
    try {
        const checkUser = await UsersModel.findOne({ userID });

        if (!checkUser) return null;

        const postID = await generateID.post();

        if (!postID) return null;

        const { location, images: listImages, video, ...info } = data;

        let images: string[] = [];

        for (const fileName of listImages) {
            const img: IImage = {
                fileName,
                userID,
                posts: postID,
            };

            const isCreateImg = await ImagesModel.createImg(img, 'posts');

            if (isCreateImg) {
                images = [...images, fileName];
            }
        }

        const { district, region, ward } = location;

        const address = await getAddress(
            region,
            district,
            ward,
            location.address
        );

        if (!address) return null;

        const coordinate = await services.coordinate(region, district, ward);

        if (!coordinate) return null;

        const postLocation: IPostLocation = {
            address,
            coordinate,
            district,
            region,
            ward,
        };

        let videoID: string | null = null;

        if (video) {
            const getVideoID = getVideoId(video);

            if (getVideoID.service === 'youtube') {
                videoID = getVideoID.id;
            }
        }

        const post = new this({
            ...info,
            postID,
            userID,
            location: postLocation,
            images,
            video: videoID,
        });

        await post.save();

        return postID;
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Posts Static Create', message);

        return null;
    }
};
PostSchema.statics.getShortlistForApp = async function (
    page: number,
    type: IPostType,
    region?: string,
    district?: string,
    search?: string,
    filter?: IPostFilter,
    sort?: IPostSort
): Promise<ResultGetShortlistForApp | null> {
    try {
        const doc = this.find({ type, status: 'accept' });
        const count = this.countDocuments({ type, status: 'accept' });

        if (region) {
            doc.find({ 'location.region': region });
            count.countDocuments({ 'location.region': region });
        }

        if (district) {
            doc.find({ 'location.district': district });
            count.countDocuments({ 'location.district': district });
        }

        if (search) {
            doc.find({
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { 'location.address': { $regex: search, $options: 'i' } },
                ],
            });
            count.countDocuments({
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { 'location.address': { $regex: search, $options: 'i' } },
                ],
            });
        }

        if (filter) {
            const { acreages, category, prices } = filter;

            if (category) {
                doc.find({ category });
                count.countDocuments({ category });
            }

            if (acreages) {
                const { max, min } = acreages;

                doc.find({ prices: { $gt: min - 1, $lt: max + 1 } });
                count.countDocuments({
                    acreages: { $gt: min - 1, $lt: max + 1 },
                });
            }

            if (prices) {
                const { max, min } = prices;

                doc.find({ prices: { $gt: min - 1, $lt: max + 1 } });
                count.countDocuments({
                    prices: { $gt: min - 1, $lt: max + 1 },
                });
            }
        }

        if (sort) {
            const { acreages, createdAt, prices } = sort;

            if (acreages) {
                doc.sort({ acreages });
            }

            if (createdAt) {
                doc.sort({ createdAt });
            }

            if (prices) {
                doc.sort({ prices });
            }
        }

        const list = await doc
            .limit(10)
            .skip(page * 10)
            .select(
                'title prices location acreages category images video legal direction postID'
            );
        const totals = await count.exec();
        const pages = getPages(totals);

        const posts: IPostCompactForApp[] = [...list].map((item) => {
            const { _id, video, images, location, ...result } = item.toObject();

            return {
                ...result,
                id: _id.toString(),
                address: location.address,
                image: images[0],
                isVideo: video !== null,
            };
        });

        return {
            totals,
            pages,
            posts,
        };
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Posts Static Get Shortlist For App', message);

        return null;
    }
};
PostSchema.statics.getShortlistForWeb = async function (
    page: number,
    type: IPostType,
    region?: string,
    district?: string,
    search?: string,
    project?: string,
    filter?: IPostFilter,
    sort?: IPostSort
): Promise<IResultGetShortlistForWeb | null> {
    try {
        const doc = this.find({ type, status: 'accept' });
        const count = this.countDocuments({ type, status: 'accept' });

        if (region) {
            doc.find({ 'location.region': region });
            count.countDocuments({
                'location.region': region,
            });
        }

        if (district) {
            doc.find({ 'location.district': district });
            count.countDocuments({ 'location.district': district });
        }

        if (search) {
            doc.find({
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { 'location.address': { $regex: search, $options: 'i' } },
                ],
            });
            count.countDocuments({
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { 'location.address': { $regex: search, $options: 'i' } },
                ],
            });
        }

        if (project) {
            doc.find({ project });
            count.countDocuments({ project });
        }

        if (filter) {
            const { acreages, category, prices } = filter;

            if (category) {
                doc.find({ category });
                count.countDocuments({ category });
            }

            if (acreages) {
                const { max, min } = acreages;

                doc.find({ acreages: { $gt: min - 1, $lt: max + 1 } });
                count.countDocuments({
                    acreages: { $gt: min - 1, $lt: max + 1 },
                });
            }

            if (prices) {
                const { max, min } = prices;

                doc.find({ prices: { $gt: min - 1, $lt: max + 1 } });
                count.countDocuments({
                    prices: { $gt: min - 1, $lt: max + 1 },
                });
            }
        }

        if (sort) {
            const { acreages, createdAt, prices } = sort;

            if (acreages) {
                doc.sort({ acreages });
            }

            if (createdAt) {
                doc.sort({ createdAt });
            }

            if (prices) {
                doc.sort({ prices });
            }
        } else {
            doc.sort({ createdAt: -1 });
        }

        const list = await doc
            .skip(page * 10)
            .limit(10)
            .select(
                'title acreages prices images video createdAt postID location type'
            );

        const totals = await count.exec();
        const pages = getPages(totals);

        const posts: IPostCompactForWeb[] = [...list].map((item) => {
            const {
                _id,
                images,
                video,
                postID,
                createdAt,
                location,
                title,
                ...result
            } = item.toObject();

            return {
                ...result,
                id: _id.toString(),
                address: location.address,
                thumbnail: images[0],
                images: images.length,
                time: new Date(createdAt).getTime(),
                isVideo: video !== null,
                link: getLink.post(title, postID),
                title,
            };
        });

        return {
            totals,
            pages,
            posts,
        };
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Posts Static Get Shortlist For Web', message);

        return null;
    }
};
PostSchema.statics.getMyShortlistForApp = async function (
    page: number,
    userID: number,
    type: IPostType,
    status: Exclude<IPostStatus, 'sold'>
): Promise<ResultGetMyShortlistForApp | null> {
    try {
        const list = await this.find({ userID, type, status })
            .select(
                'title prices acreages category legal direction images video location postID'
            )
            .limit(10)
            .skip(page * 10);
        const totals = await this.countDocuments({ userID, type, status });

        const pages = getPages(totals);
        const posts: IPostCompactForApp[] = [...list].map((item) => {
            const { _id, video, images, location, ...result } = item.toObject();

            return {
                ...result,
                address: location.address,
                image: images[0],
                isVideo: video !== null,
                id: _id.toString(),
            };
        });

        return {
            pages,
            posts,
        };
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Posts Static Get My Shortlist For App', message);

        return null;
    }
};
PostSchema.statics.getMyShortlistForWeb = async function (
    page: number,
    userID: number,
    status?: IPostStatus
): Promise<IApiWebPostMyShortlist | null> {
    try {
        const doc = this.find({ userID });
        const count = this.countDocuments({ userID });

        if (status) {
            doc.find({ status });
            count.countDocuments({ status });
        }

        const list = await doc
            .skip(page * 10)
            .limit(10)
            .select('status type title images location video postID');
        const totals = await count.exec();

        const pages = getPages(totals);
        const posts: IPostCompactModeEditorForWeb[] = [...list].map((item) => {
            const { _id, images, location, video, ...result } = item.toObject();

            return {
                ...result,
                id: _id.toString(),
                thumbnail: images[0],
                images: images.length,
                isVideo: video !== null,
                address: location.address,
            };
        });

        return {
            pages,
            posts,
        };
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Posts Static Get My Shortlist For Web', message);

        return null;
    }
};
PostSchema.statics.getInfoForWeb = async function (
    postID: number
): Promise<IPostInfoForWeb | null> {
    try {
        const post = await this.findOne(
            { postID },
            { projection: { _id: 0 } }
        ).select('updatedAt editor postID');

        if (!post) return null;

        const {
            location,
            poster,
            broker: brokerID,
            createdAt,
            userID,
            ...result
        } = post.toObject();

        const { address, coordinate } = location;

        let contact = poster.name;
        let phoneNumber = poster.phoneNumber;
        let avatar: string | null = null;
        let zalo: string | null = null;
        let facebook: string | null = null;

        if (brokerID) {
            const broker = await BrokersModel.getInfo(brokerID);

            if (broker) {
                contact = broker.name;
                phoneNumber = broker.phoneNumber;
                avatar = broker.avatar;
                zalo = broker.zalo;
                facebook = broker.facebook;
            }
        } else {
            const user = await UsersModel.findOne({ userID });

            if (user) {
                avatar = user.avatar;
            }
        }

        return {
            ...result,
            contact,
            phoneNumber,
            address,
            coordinate,
            time: new Date(createdAt).getTime(),
            avatar,
            zalo,
            facebook,
        };
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Posts Static Get Info For Web', message);

        return null;
    }
};
PostSchema.statics.getInfoForApp = async function (
    postID: number
): Promise<IPostInfoForApp | null> {
    try {
        const result = await this.getInfoForWeb(postID);

        if (!result) return null;

        const link = getLink.post(result.title, result.postID);

        return {
            ...result,
            link,
        };
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Posts Static Get Info For App', message);

        return null;
    }
};
PostSchema.statics.getMyPostInfo = async function (
    postID: number,
    userID: number
): Promise<IMyPostInfo | null> {
    try {
        const user = await UsersModel.findOne({ userID });

        if (!user) return null;

        const post = await this.findOne(
            { postID, userID },
            { projection: { _id: 0 } }
        ).select('createdAt -userID -broker -views -editor -updatedAt');

        if (!post) return null;

        const { createdAt, ...result } = post.toObject();

        return {
            ...result,
            time: new Date(createdAt).getTime(),
        };
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Posts', message);

        return null;
    }
};
PostSchema.statics.getForDashboardWeb = async function (
    type: IPostType,
    page: number
): Promise<IPostResultGetForDashboardWeb | null> {
    try {
        const list = await this.find({ type, status: 'accept' })
            .sort({ createdAt: -1 })
            .limit(6)
            .skip(page * 6)
            .select(
                'title acreages prices direction facades ways location createdAt images postID category type'
            );
        const totals = await this.countDocuments({ type, status: 'accept' });

        if (totals < 6) return null;

        const pages = getPages(totals, 6);
        const posts: IPostCompactForWebDashboard[] = [...list].map((item) => {
            const {
                _id,
                location,
                images,
                createdAt,
                postID,
                title,
                ...result
            } = item.toObject();

            const { address } = location;
            const id = _id.toString();
            const link = getLink.post(title, postID);
            const time = new Date(createdAt).getTime();
            const thumbnail = images[0];

            return {
                ...result,
                id,
                address,
                link,
                time,
                thumbnail,
                title,
            };
        });

        return {
            pages,
            posts,
        };
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Posts Static Get For Dashboard Web', message);

        return null;
    }
};
PostSchema.statics.getForProject = async function (
    project: string
): Promise<IPostCompactModeVerticalForWeb[] | null> {
    try {
        const posts = await this.find({ project, status: 'accept' }).select(
            'title images prices acreages postID location type'
        );

        if (posts.length === 0) return null;

        const result: IPostCompactModeVerticalForWeb[] = [...posts].map(
            (item) => {
                const { _id, location, title, postID, images, ...result } =
                    item.toObject();

                const id = _id.toString();
                const thumbnail = images[0];
                const link = getLink.project(title, postID);
                const { address } = location;

                return {
                    ...result,
                    id,
                    thumbnail,
                    link,
                    address,
                    title,
                };
            }
        );

        return result;
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Posts Static Get For Project', message);

        return null;
    }
};
PostSchema.statics.getForNews =
    async function (): Promise<IPostResultGetForNews | null> {
        try {
            let sell: IPostCompactModeVerticalForWeb[] | null = null;
            let rent: IPostCompactModeVerticalForWeb[] | null = null;

            const listSell = await this.find({
                type: 'sell',
                status: 'accept',
            }).select('title images prices acreages postID location type');
            const listRent = await this.find({
                type: 'rent',
                status: 'accept',
            }).select('title images prices acreages postID location type');

            if (listSell.length >= 4) {
                sell = [...listSell].slice(0, 4).map((item) => {
                    const { _id, title, postID, images, location, ...result } =
                        item.toObject();

                    const id = _id.toString();
                    const thumbnail = images[0];
                    const { address } = location;
                    const link = getLink.post(title, postID);

                    return {
                        ...result,
                        id,
                        title,
                        thumbnail,
                        address,
                        link,
                    };
                });
            }

            if (listRent.length >= 4) {
                rent = [...listRent].slice(0, 4).map((item) => {
                    const { _id, title, postID, images, location, ...result } =
                        item.toObject();

                    const id = _id.toString();
                    const thumbnail = images[0];
                    const { address } = location;
                    const link = getLink.post(title, postID);

                    return {
                        ...result,
                        id,
                        title,
                        thumbnail,
                        address,
                        link,
                    };
                });
            }

            if (sell === null && rent === null) return null;

            return {
                rent,
                sell,
            };
        } catch (error) {
            const { message } = error as Error;

            handleError('Model Posts Static Get For News', message);

            return null;
        }
    };
PostSchema.statics.getTotalsByAreasForDashboardWeb =
    async function (): Promise<IPostTotalsByAreaDashboardWeb | null> {
        try {
            const hn = await this.countDocuments({
                'location.region': 'HN',
                status: 'accept',
            });
            const hcm = await this.countDocuments({
                'location.region': 'SG',
                status: 'accept',
            });
            const bn = await this.countDocuments({
                'location.region': 'BN',
                status: 'accept',
            });
            const bg = await this.countDocuments({
                'location.region': 'BG',
                status: 'accept',
            });
            const hd = await this.countDocuments({
                'location.region': 'HD',
                status: 'accept',
            });

            return { hn, hcm, bn, bg, hd };
        } catch (error) {
            const { message } = error as Error;

            handleError(
                'Model Posts Static Get Totals By Areas For Dashboard Web',
                message
            );

            return null;
        }
    };
PostSchema.statics.getTotalsByAreas = async function (
    type: IPostType,
    id?: string
): Promise<ITotalsByAreas[] | null> {
    try {
        let result: ITotalsByAreas[] = [];

        if (id) {
            const getDistrict = await DistrictsModel.findOne({ regionID: id });

            if (!getDistrict) return null;

            const { districts } = getDistrict.toObject();

            for (const district of districts) {
                const { districtID, name } = district;

                const totals = await this.countDocuments({
                    'location.district': districtID,
                    type,
                    status: 'accept',
                });

                result = [...result, { name, totals, id: districtID }];
            }

            return result;
        }

        const regions = await RegionsModel.find({ isActive: true });

        for (const region of regions) {
            const { regionID, name } = region.toObject();

            const totals = await this.countDocuments({
                'location.region': regionID,
                type,
                status: 'accept',
            });

            result = [...result, { name, totals, id: regionID }];
        }

        return result;
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Posts Static Get Totals By Areas', message);

        return null;
    }
};
PostSchema.statics.countViews = async function (
    postID: number
): Promise<boolean> {
    try {
        const post = await this.findOne({ postID });

        if (!post) return false;

        const updateViews = post.views + 1;

        post.views = updateViews;

        await post.save();

        return true;
    } catch (error) {
        const { message } = error as Error;

        handleError('Modal Posts Static Count Views', message);

        return false;
    }
};

// Methods
PostSchema.methods.removePost = async function () {
    try {
        const { images, userID, postID, status } = this;

        const user = await UsersModel.findOne({ userID });

        if (!user) return false;

        const isRemove = await user.removePost(
            status === 'pending' ? 'pending' : 'accept'
        );

        if (!isRemove) return false;

        for (const image of images) {
            await ImagesModel.removeImg(image, userID, 'posts', postID);
        }

        await this.remove();

        return true;
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Posts Method Remove Post', message);

        return false;
    }
};
PostSchema.methods.updateByUser = async function (data) {
    try {
        const { userID, postID } = this;

        const {
            acreages,
            category,
            content,
            direction,
            facades,
            images,
            legal,
            location,
            poster,
            prices,
            project,
            removeImages,
            title,
            type,
            video,
            ways,
        } = data;

        if (title) {
            this.title = title;
        }

        if (content) {
            this.content = content;
        }

        if (acreages) {
            this.acreages = acreages;
        }

        if (prices) {
            this.prices = prices;
        }

        if (category) {
            this.category = category;
        }

        if (type) {
            this.type = type;
        }

        if (direction !== undefined) {
            this.direction = direction;
        }

        if (legal !== undefined) {
            this.legal = legal;
        }

        if (facades !== undefined) {
            this.facades = facades;
        }

        if (ways !== undefined) {
            this.ways = ways;
        }

        if (project !== undefined) {
            this.project = project;
        }

        if (video) {
            const videoID = getVideoId(video);

            if (videoID.service === 'youtube') {
                this.video = videoID.id;
            }
        }

        if (location) {
            const { address, district, region, ward } = location;

            if (address || district || region || ward) {
                const updateRegion = region ? region : this.location.region;
                const updateDistrict = district
                    ? district
                    : this.location.district;
                const updateWard = ward ? ward : this.location.ward;
                const updateAddress =
                    address !== undefined
                        ? address
                        : this.location.address.split(',')[0];

                if (region) {
                    this.location.region = region;
                }

                if (district) {
                    this.location.district = district;
                }

                if (ward) {
                    this.location.ward = ward;
                }

                const addressNew = await getAddress(
                    updateRegion,
                    updateDistrict,
                    updateWard,
                    updateAddress
                );

                if (!addressNew) return false;

                if (region || district || ward) {
                    const coordinate = await services.coordinate(
                        updateRegion,
                        updateDistrict,
                        updateWard
                    );

                    if (!coordinate) return false;

                    this.location.coordinate = coordinate;
                }

                this.location.address = addressNew;
            }
        }

        if (poster) {
            const { name, phoneNumber } = poster;

            if (name) {
                this.poster.name = name;
            }

            if (phoneNumber) {
                this.poster.phoneNumber = phoneNumber;
            }
        }

        let updateImages = [...this.images];

        let createImageFailed: string[] = [];
        let removeImageFailed: string[] = [];

        if (images) {
            for (const fileName of images) {
                const image: IImage = {
                    fileName,
                    userID,
                    posts: postID,
                };

                const isCreate = await ImagesModel.createImg(image, 'posts');

                if (isCreate) {
                    updateImages = [...updateImages, fileName];
                } else {
                    createImageFailed = [...createImageFailed, fileName];
                }
            }
        }

        if (removeImages) {
            for (const fileName of removeImages) {
                const isRemove = await ImagesModel.removeImg(
                    fileName,
                    userID,
                    'posts',
                    postID
                );

                if (isRemove) {
                    const index = [...updateImages].indexOf(fileName);

                    if (index > -1) {
                        updateImages = [...updateImages].splice(index, 1);
                    }
                } else {
                    removeImageFailed = [...removeImageFailed, fileName];
                }
            }
        }

        this.images = updateImages;

        await this.save();

        if (createImageFailed.length !== 0 || removeImageFailed.length !== 0)
            return {
                create: createImageFailed,
                remove: removeImageFailed,
            };

        return true;
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Posts Method Update By User', message);

        return false;
    }
};
PostSchema.methods.sold = async function () {
    try {
        this.status = 'sold';

        await this.save();

        return true;
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Posts Method Sold', message);

        return false;
    }
};

// Model
const Index = model<IPost, PostModel>('Posts', PostSchema);

export default Index;
