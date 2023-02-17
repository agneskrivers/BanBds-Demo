import { model, Model, Schema } from 'mongoose';

// Helpers
import { handleError, getPages, getLink } from '@server/helpers';

// Interfaces
import type {
    INews,
    INewsCompactForApp,
    IHotNewsCompactForApp,
    INewsInfo,
    INewsResultGetForDashboardWeb,
    INewsCompactForWebDashboard,
    IHotNewsCompactForWebDashboard,
    INewsCompactForWeb,
    INewsCompactModeSmallForWeb,
    INewsCompactModeTitleForWeb,
    INewsResultGetShortlistForWeb,
    INewsResultGetInfoForWeb,
} from '@interfaces';

// Interface
interface ResultGetShortlistForApp {
    hot: IHotNewsCompactForApp | null;
    news: INewsCompactForApp[];
    pages: number;
}

// Model Interface
interface NewsModel extends Model<INews> {
    getShortlistForApp(
        page: number,
        region: string
    ): Promise<ResultGetShortlistForApp | null>;
    getShortlistForWeb(
        page: number,
        list?: number[]
    ): Promise<INewsResultGetShortlistForWeb | null>;
    getInfoByID(id: string): Promise<INewsInfo | null>;
    getInfoByNewsID(newsID: number): Promise<INewsResultGetInfoForWeb | null>;
    getForDashboardWeb(): Promise<INewsResultGetForDashboardWeb | null>;
    countViews(newsID: number): Promise<boolean>;
}

// Schema
const NewsSchema = new Schema<INews, NewsModel>(
    {
        newsID: { type: Number, unique: true, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        content: { type: String, required: true },
        thumbnail: { type: String, required: true },
        images: { type: [String], required: true },
        creator: { type: String, required: true },
        editor: { type: String, default: null },
        views: { type: Number, default: 0 },
        region: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

// Statics
NewsSchema.statics.getShortlistForApp = async function (
    page: number,
    region: string
): Promise<ResultGetShortlistForApp | null> {
    try {
        const count = this.countDocuments();
        const doc = this.find();

        doc.find({ region: { $in: ['all', region] } });
        count.countDocuments({ region: { $in: ['all', region] } });

        const totals = await count.exec();

        let hot: IHotNewsCompactForApp | null = null;

        if (totals >= 15) {
            const hotNewsDoc = this.findOne()
                .sort('-views')
                .select('title description thumbnail');

            if (region) {
                const hotNews = await hotNewsDoc.findOne({ region });

                if (hotNews) {
                    const { _id, ...result } = hotNews.toObject();

                    hot = {
                        ...result,
                        id: _id.toString(),
                    };
                }
            }

            if (hot) {
                doc.find({ _id: { $ne: hot.id } });
            }
        }

        const list = await doc
            .limit(10)
            .skip(page * 10)
            .select('title thumbnail createdAt');

        const pages = getPages(page);
        const news: INewsCompactForApp[] = [...list].map((item) => {
            const { _id, createdAt, ...result } = item.toObject();

            return {
                ...result,
                id: _id.toString(),
                createdAt: new Date(createdAt).getTime(),
            };
        });

        return {
            hot,
            news,
            pages,
        };
    } catch (error) {
        const { message } = error as Error;

        handleError('Model News Static Get Shortlist For App', message);

        return null;
    }
};
NewsSchema.statics.getShortlistForWeb = async function (
    page: number,
    list?: number[]
): Promise<INewsResultGetShortlistForWeb | null> {
    try {
        if (page === 0) {
            let top: INewsCompactModeSmallForWeb[] | null = null;
            let mostViews: INewsCompactModeTitleForWeb[] | null = null;

            let listNewsID: number[] = [];

            const count = await this.countDocuments();

            if (count >= 23) {
                const topList = await this.find().sort({ views: -1 }).limit(13);

                top = [...topList].slice(0, 3).map((item) => {
                    const { _id, title, thumbnail, newsID, createdAt } =
                        item.toObject();

                    const id = _id.toString();
                    const time = new Date(createdAt).getTime();
                    const link = getLink.news(title, newsID);

                    return {
                        id,
                        link,
                        newsID,
                        thumbnail,
                        time,
                        title,
                    };
                });
                mostViews = [...topList].slice(3, 13).map((item) => {
                    const { _id, title, newsID } = item.toObject();

                    const id = _id.toString();
                    const link = getLink.news(title, newsID);

                    return {
                        id,
                        link,
                        title,
                        newsID,
                    };
                });
                listNewsID = [...topList].map((item) => item.newsID);
            }

            const listNews = await this.find({ newsID: { $nin: listNewsID } })
                .limit(10)
                .select('createdAt title newsID description thumbnail');

            const latests: INewsCompactForWeb[] = [...listNews].map((item) => {
                const { _id, createdAt, title, newsID, ...result } =
                    item.toObject();

                const id = _id.toString();
                const time = new Date(createdAt).getTime();
                const link = getLink.news(title, newsID);

                return {
                    ...result,
                    id,
                    time,
                    link,
                    title,
                    newsID,
                };
            });
            const pages = getPages(count >= 23 ? count - 13 : count);

            return {
                mode: 'first',
                latests,
                mostViews,
                pages,
                top,
            };
        }

        if (!list) return null;

        const news = await this.find({ newsID: { $nin: list } })
            .limit(10)
            .select('createdAt title newsID description thumbnail')
            .skip(page * 10);

        const latests: INewsCompactForWeb[] = [...news].map((item) => {
            const { _id, createdAt, title, newsID, ...result } =
                item.toObject();

            const id = _id.toString();
            const time = new Date(createdAt).getTime();
            const link = getLink.news(title, newsID);

            return {
                ...result,
                id,
                time,
                link,
                title,
                newsID,
            };
        });

        return {
            mode: 'more',
            latests,
        };
    } catch (error) {
        const { message } = error as Error;

        handleError('Model News Static Get Shortlist For Web', message);

        return null;
    }
};
NewsSchema.statics.getInfoByID = async function (
    id: string
): Promise<INewsInfo | null> {
    try {
        const news = await this.findById(id, { projection: { _id: 0 } }).select(
            'title description content createdAt'
        );

        if (!news) return null;

        const { createdAt, ...result } = news.toObject();

        return {
            ...result,
            time: new Date(createdAt).getTime(),
        };
    } catch (error) {
        const { message } = error as Error;

        handleError('Model News Static Get Info', message);

        return null;
    }
};
NewsSchema.statics.getInfoByNewsID = async function (
    newsID: number
): Promise<INewsResultGetInfoForWeb | null> {
    try {
        const info = await this.findOne({ newsID }).select(
            'title description content createdAt'
        );

        if (!info) return null;

        const { createdAt, ...result } = info.toObject();

        const time = new Date(createdAt).getTime();
        const data = { ...result, time };

        let more: INewsCompactForWeb[] | null = null;

        const list = await this.find({ newsID: { $ne: newsID } })
            .limit(5)
            .select('createdAt title newsID description thumbnail');

        if (list.length > 0) {
            more = [...list].map((item) => {
                const { _id, createdAt, title, newsID, ...result } =
                    item.toObject();

                const id = _id.toString();
                const time = new Date(createdAt).getTime();
                const link = getLink.news(title, newsID);

                return {
                    ...result,
                    id,
                    time,
                    link,
                    title,
                    newsID,
                };
            });
        }

        return {
            data,
            more,
        };
    } catch (error) {
        const { message } = error as Error;

        handleError('Model News Static Get Info For Web', message);

        return null;
    }
};
NewsSchema.statics.getForDashboardWeb =
    async function (): Promise<INewsResultGetForDashboardWeb | null> {
        try {
            const hots = await this.find()
                .sort({ views: -1 })
                .select('title thumbnail description newsID');

            if (hots.length < 7) return null;

            const { _id, title, description, thumbnail, newsID } =
                hots[0].toObject();

            const hotID = _id.toString();
            const hotLink = getLink.news(title, newsID);

            const hot: IHotNewsCompactForWebDashboard = {
                content: description,
                id: hotID,
                link: hotLink,
                thumbnail,
                title,
            };

            const list = await this.find({ _id: { $ne: _id } })
                .limit(6)
                .select('title newsID');

            const latests: INewsCompactForWebDashboard[] = [...list].map(
                (item) => {
                    const { _id, title, newsID } = item.toObject();

                    const id = _id.toString();

                    const link = getLink.news(title, newsID);

                    return { id, link, title };
                }
            );

            return {
                hot,
                latests,
            };
        } catch (error) {
            const { message } = error as Error;

            handleError('Model News Static Get For Dashboard Web', message);

            return null;
        }
    };
NewsSchema.statics.countViews = async function (
    newsID: number
): Promise<boolean> {
    try {
        const news = await this.findOne({ newsID });

        if (!news) return false;

        const updateViews = news.views + 1;

        news.views = updateViews;

        await news.save();

        return true;
    } catch (error) {
        const { message } = error as Error;

        handleError('Model News Static Count Views', message);

        return false;
    }
};

// Models
const Index = model<INews, NewsModel>('News', NewsSchema);

export default Index;
