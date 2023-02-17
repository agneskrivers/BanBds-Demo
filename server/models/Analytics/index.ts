import { model, Model, Schema, Document, Types } from 'mongoose';

// Helpers
import { handleError } from '@server/helpers';

// Interfaces
import type { IAnalyticType, IAnalytics } from '@interfaces';

// Type
type AnalyticDocument = Document<unknown, unknown, IAnalytics> &
    IAnalytics & { _id: Types.ObjectId };

// Model Interface
interface AnalyticModel extends Model<IAnalytics> {
    check(): Promise<AnalyticDocument | null>;
    updateAnalytic(type: IAnalyticType): Promise<void>;
}

// Schema
const AnalyticSchema = new Schema<IAnalytics, AnalyticModel>(
    {
        day: { type: Number, required: true },
        month: { type: Number, required: true },
        year: { type: Number, required: true },
        app: { type: Number, default: 0 },
        web: { type: Number, default: 0 },
    },
    {
        timestamps: false,
    }
);

// Statics
AnalyticSchema.statics.check =
    async function (): Promise<AnalyticDocument | null> {
        const now = new Date(Date.now());

        const day = now.getDate();
        const month = now.getMonth();
        const year = now.getFullYear();

        try {
            const checkAnalytic = await this.findOne({ day, month, year });

            if (checkAnalytic) return checkAnalytic;

            const analytic = new this({ day, month, year });

            const analyticSave = await analytic.save();

            return analyticSave;
        } catch (error) {
            const { message } = error as Error;

            handleError('Model Analytics Static Check', message);

            return null;
        }
    };
AnalyticSchema.statics.updateAnalytic = async function (
    type: IAnalyticType
): Promise<void> {
    try {
        const analytic = await this.check();

        if (!analytic) return;

        const updateCount = analytic[type] + 1;

        analytic[type] = updateCount;

        await analytic.save();
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Analytics Static Update', message);
    }
};

// Model
const Index = model<IAnalytics, AnalyticModel>('Analytics', AnalyticSchema);

export default Index;
