import { model, Model, Schema } from 'mongoose';

// Helpers
import { handleError } from '@server/helpers';

// Interfaces
import type { IInvestor } from '@interfaces';

// Model Interface
interface InvestorModel extends Model<IInvestor> {
    getName(id: string): Promise<string | null>;
    getInfo(id: string): Promise<IInvestor | null>;
}

// Schema
const InvestorSchema = new Schema<IInvestor, InvestorModel>(
    {
        name: { type: String, required: true },
        avatar: { type: String, default: null },
    },
    {
        timestamps: false,
    }
);

// Statics
InvestorSchema.statics.getName = async function (
    id: string
): Promise<string | null> {
    try {
        const investor = await this.findById(id);

        if (!investor) return null;

        return investor.name;
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Investors Static Get Name', message);

        return null;
    }
};
InvestorSchema.statics.getInfo = async function (
    id: string
): Promise<IInvestor | null> {
    try {
        const investor = await this.findById(id);

        if (!investor) return null;

        return investor.toObject();
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Investors Statics Get Info', message);

        return null;
    }
};

// Model
const Index = model<IInvestor, InvestorModel>('Investors', InvestorSchema);

export default Index;
