import { model, Model, Schema } from 'mongoose';

// Helpers
import { handleError, getPages, getLink } from '@server/helpers';

// Models
import { InvestorsModel, RegionsModel, DistrictsModel } from '@server/models';

// Interfaces
import type {
    IInvestor,
    IProject,
    IProjectCompactForApp,
    IProjectInfo,
    IResultGetShortlistForApp,
    ISelect,
    IProjectCompactForWebDashboard,
    ITotalsByAreas,
    IProjectStatus,
    IProjectType,
    IProjectResultGetShortlistForWeb,
    IPostFilterByValue,
    IProjectCompactForWeb,
} from '@interfaces';

// Model Interface
interface ProjectModel extends Model<IProject> {
    getShortlistForApp(
        page: number,
        region: string,
        id?: string
    ): Promise<IResultGetShortlistForApp | null>;
    getShortlistForWeb(
        page: number,
        region?: string,
        district?: string,
        search?: string,
        type?: IProjectType,
        status?: IProjectStatus,
        prices?: IPostFilterByValue
    ): Promise<IProjectResultGetShortlistForWeb | null>;
    getInfo(projectID: number): Promise<IProjectInfo | null>;
    getListSelectForWeb(): Promise<ISelect[] | null>;
    getForDashboardWeb(): Promise<IProjectCompactForWebDashboard[] | null>;
    getTotalsByAreas(id?: string): Promise<ITotalsByAreas[] | null>;
    countViews(projectID: number): Promise<boolean>;
}

// Schema
const ProjectSchema = new Schema<IProject, ProjectModel>(
    {
        projectID: {
            type: Number,
            required: true,
            immutable: true,
            unique: true,
        },
        title: { type: String, required: true },
        content: { type: String, required: true },
        acreages: { type: String, required: true },
        prices: { type: Schema.Types.Mixed, required: true },
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
        type: { type: String, required: true, enum: ['apartment', 'land'] },
        status: {
            type: String,
            required: true,
            enum: ['onSale', 'openingSoon', 'handedOver'],
        },
        investor: { type: String, default: null },
        images: { type: [String], required: true },
        overview: {
            type: {
                numberOfApartments: { type: Number, required: true },
                courtNumber: { type: Number, required: true },
                legal: { type: String, required: true },
            },
            default: null,
        },
        views: { type: Number, default: 0 },
        editor: { type: String, default: null },
        creator: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

// Statics
ProjectSchema.statics.getShortlistForApp = async function (
    page: number,
    region: string,
    id?: string
): Promise<IResultGetShortlistForApp | null> {
    try {
        const totals = await this.countDocuments({ 'location.region': region });
        const doc = this.find({ 'location.region': region });

        let hot: IProjectCompactForApp | null = null;

        if (page === 0) {
            if (totals >= 15) {
                const hotProject = await this.findOne({
                    'location.region': region,
                })
                    .sort('-views')
                    .select(
                        'title prices status type acreages location investor images'
                    );

                if (hotProject) {
                    const { _id, location, investor, images, ...result } =
                        hotProject.toObject();

                    let company: string | null = null;

                    if (investor) {
                        company = await InvestorsModel.getName(investor);
                    }

                    hot = {
                        ...result,
                        id: _id.toString(),
                        image: images[0],
                        address: location.address,
                        company,
                    };
                }
            }

            if (hot) {
                doc.find({ _id: { $ne: hot.id } });
            }
        }

        if (id) {
            doc.find({ _id: { $ne: id } });
        }

        const list = await doc
            .limit(10)
            .skip(page * 10)
            .select(
                'title prices status type acreages location investor images projectID'
            );

        const pages = getPages(totals - 1);
        const projects: IProjectCompactForApp[] = await Promise.all(
            [...list].map(async (item): Promise<IProjectCompactForApp> => {
                const { _id, location, images, investor, ...result } =
                    item.toObject();

                let company: string | null = null;

                if (investor) {
                    company = await InvestorsModel.getName(investor);
                }

                return {
                    ...result,
                    id: _id.toString(),
                    address: location.address,
                    image: images[0],
                    company,
                };
            })
        );

        return {
            pages,
            projects,
            hot,
        };
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Projects Static Get Shortlist For App', message);

        return null;
    }
};
ProjectSchema.statics.getShortlistForWeb = async function (
    page: number,
    region?: string,
    district?: string,
    search?: string,
    type?: IProjectType,
    status?: IProjectStatus,
    prices?: IPostFilterByValue
): Promise<IProjectResultGetShortlistForWeb | null> {
    try {
        const doc = this.find();
        const count = this.countDocuments();

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

        if (type) {
            doc.find({ type });
            count.countDocuments({ type });
        }

        if (status) {
            doc.find({ status });
            count.countDocuments({ status });
        }

        if (prices) {
            const { min, max } = prices;

            doc.find({
                prices: { $gt: min - 1, $lt: max + 1 },
            });
            count.countDocuments({ prices: { $gt: min - 1, $lt: max + 1 } });
        }

        const list = await doc
            .limit(10)
            .skip(page * 10)
            .select(
                'title prices status type acreages images location investor overview projectID'
            );

        const totals = await count.exec();
        const pages = getPages(totals);
        const projects: IProjectCompactForWeb[] = await Promise.all(
            [...list].map(async (item): Promise<IProjectCompactForWeb> => {
                const {
                    _id,
                    title,
                    images,
                    overview,
                    location,
                    projectID,
                    investor: investorID,
                    ...result
                } = item.toObject();

                const id = _id.toString();
                const thumbnail = images[0];
                const { address } = location;
                const link = getLink.project(title, projectID);

                let numberOfApartments: number | null = null;
                let courtNumber: number | null = null;
                let investor: IInvestor | null = null;

                if (overview) {
                    numberOfApartments = overview.numberOfApartments;
                    courtNumber = overview.courtNumber;
                }

                if (investorID) {
                    investor = await InvestorsModel.getInfo(investorID);
                }

                return {
                    ...result,
                    title,
                    id,
                    thumbnail,
                    images: images.length,
                    numberOfApartments,
                    courtNumber,
                    investor,
                    address,
                    link,
                };
            })
        );

        return {
            pages,
            projects,
            totals,
        };
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Projects Static Get Shortlist For Web', message);

        return null;
    }
};
ProjectSchema.statics.getInfo = async function (
    projectID: number
): Promise<IProjectInfo | null> {
    try {
        const project = await this.findOne({ projectID }).select(
            'acreages content overview type prices status title images investor location'
        );

        if (!project) return null;

        const {
            location,
            investor: investorID,
            title,
            _id,
            ...result
        } = project.toObject();

        const link = getLink.project(title, projectID);
        const id = _id.toString();
        const { address, coordinate } = location;

        let investor: IInvestor | null = null;

        if (investorID) {
            const checkInvestorID = await InvestorsModel.findById(investorID, {
                projection: { _id: 0 },
            });

            if (checkInvestorID) {
                investor = checkInvestorID.toObject();
            }
        }

        return {
            ...result,
            coordinate,
            address,
            investor,
            link,
            title,
            id,
        };
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Projects Static Get Info For App', message);

        return null;
    }
};
ProjectSchema.statics.getListSelectForWeb = async function () {
    try {
        const list = await this.find();

        const result: ISelect[] = [...list].map((item) => {
            const { _id, title } = item.toObject();

            return {
                value: _id.toString(),
                label: decodeURI(title),
            };
        });

        return result;
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Projects Static Get List Select For Web', message);

        return null;
    }
};
ProjectSchema.statics.getForDashboardWeb = async function () {
    try {
        const projects = await this.find()
            .sort({ views: -1 })
            .limit(3)
            .select(
                'title acreages prices status investor images projectID location type'
            );
        const totals = await this.countDocuments();

        if (totals < 3) return null;

        const result: IProjectCompactForWebDashboard[] = await Promise.all(
            [...projects].map(
                async (item): Promise<IProjectCompactForWebDashboard> => {
                    const {
                        _id,
                        location,
                        images,
                        investor: investorID,
                        projectID,
                        title,
                        ...result
                    } = item.toObject();

                    const id = _id.toString();
                    const { address } = location;
                    const link = getLink.project(title, projectID);

                    let investor: string | null = null;

                    if (investorID) {
                        investor = await InvestorsModel.getName(investorID);
                    }

                    return {
                        ...result,
                        thumbnail: images[0],
                        title,
                        id,
                        address,
                        link,
                        investor,
                    };
                }
            )
        );

        return result;
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Projects Static Get For Web Dashboard', message);
        return null;
    }
};
ProjectSchema.statics.getTotalsByAreas = async function (id?: string) {
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
            });

            result = [...result, { name, totals, id: regionID }];
        }

        return result;
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Projects Static Get Totals By Areas', message);

        return null;
    }
};
ProjectSchema.statics.countViews = async function (
    projectID: number
): Promise<boolean> {
    try {
        const project = await this.findOne({ projectID });

        if (!project) return false;

        const updateViews = project.views + 1;

        project.views = updateViews;

        await project.save();

        return true;
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Projects Static Count Views', message);

        return false;
    }
};

// Model
const Index = model<IProject, ProjectModel>('Projects', ProjectSchema);

export default Index;
