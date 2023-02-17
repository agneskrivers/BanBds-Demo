import { model, Model, Schema } from 'mongoose';

// Helpers
import { handleError } from '@server/helpers';

// Interfaces
import type { IWard, IWardInfo } from '@interfaces';

// Model Interface
interface WardModel extends Model<IWard> {
    getName(districtID: string, wardID: string): Promise<string | null>;
    getList(): Promise<IWard[] | null>;
    getListByDistrictID(districtID: string): Promise<IWardInfo[] | null>;
}

// Schema
const WardSchema = new Schema<IWard, WardModel>(
    {
        districtID: {
            type: String,
            required: true,
            immutable: true,
            unique: true,
        },
        wards: {
            type: [
                {
                    wardID: {
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
WardSchema.statics.getName = async function (
    districtID: string,
    wardID: string
): Promise<string | null> {
    try {
        const ward = await this.findOne({ districtID });

        if (!ward) return null;

        const findWard = [...ward.wards].find((item) => item.wardID === wardID);

        if (!findWard) return null;

        return findWard.name;
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Wards Static Get Name', message);

        return null;
    }
};
WardSchema.statics.getList = async function (): Promise<IWard[] | null> {
    try {
        const wards = await this.find();

        const result = [...wards].map((item) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { _id, ...result } = item.toObject();

            return result;
        });

        return result;
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Wards Static Get List', message);

        return null;
    }
};
WardSchema.statics.getListByDistrictID = async function (
    districtID: string
): Promise<IWardInfo[] | null> {
    try {
        const ward = await this.findOne({ districtID });

        if (!ward) return null;

        return ward.wards;
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Wards Static Get List By District ID', message);

        return null;
    }
};

// Model
const Index = model<IWard, WardModel>('Wards', WardSchema);

export default Index;
