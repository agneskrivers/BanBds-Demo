import { model, Model, Schema } from 'mongoose';

// Helpers
import { handleError } from '@server/helpers';

// Interfaces
import type { IDistrict, IDistrictInfo } from '@interfaces';

// Model Interface
interface DistrictModel extends Model<IDistrict> {
    getName(regionID: string, districtID: string): Promise<string | null>;
    getList(): Promise<IDistrict[] | null>;
    getListByRegionID(regionID: string): Promise<IDistrictInfo[] | null>;
}

// Schema
const DistrictSchema = new Schema<IDistrict, DistrictModel>(
    {
        regionID: {
            type: String,
            required: true,
            immutable: true,
            unique: true,
        },
        districts: {
            type: [
                {
                    districtID: {
                        type: String,
                        required: true,
                        immutable: true,
                        unique: true,
                    },
                    name: { type: String, required: true, immutable: true },
                    _id: false,
                },
            ],
            required: true,
        },
    },
    {
        timestamps: false,
    }
);

// Statics
DistrictSchema.statics.getName = async function (
    regionID: string,
    districtID: string
): Promise<string | null> {
    try {
        const district = await this.findOne({ regionID });

        if (!district) return null;

        const findDistrict = [...district.districts].find(
            (item) => item.districtID === districtID
        );

        if (!findDistrict) return null;

        return findDistrict.name;
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Districts Static Get Name', message);

        return null;
    }
};
DistrictSchema.statics.getList = async function () {
    try {
        const districts = await this.find();

        const result = [...districts].map((item) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { _id, ...result } = item.toObject();

            return result;
        });

        return result;
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Districts Static Get List', message);

        return null;
    }
};
DistrictSchema.statics.getListByRegionID = async function (
    regionID: string
): Promise<IDistrictInfo[] | null> {
    try {
        const district = await this.findOne({ regionID });

        if (!district) return null;

        return district.districts;
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Districts Static Get List By Region ID', message);

        return null;
    }
};

// Model
const Index = model<IDistrict, DistrictModel>('Districts', DistrictSchema);

export default Index;
