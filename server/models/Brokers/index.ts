import { model, Model, Schema } from 'mongoose';

// Helpers
import { handleError } from '@server/helpers';

// Interfaces
import type { IBroker } from '@interfaces';

// Model Interface
interface BrokerModel extends Model<IBroker> {
    getInfo(id: string): Promise<IBroker | null>;
}

// Schema
const BrokerSchema = new Schema<IBroker, BrokerModel>(
    {
        name: { type: String, required: true },
        phoneNumber: { type: [String], required: true },
        avatar: { type: String, default: null },
        zalo: { type: String, default: null },
        facebook: { type: String, default: null },
        note: { type: String, default: null },
    },
    {
        timestamps: false,
    }
);

// Statics
BrokerSchema.statics.getInfo = async function (
    id: string
): Promise<IBroker | null> {
    try {
        const data = await this.findById(id, { projection: { _id: 0 } });

        if (!data) return null;

        return data.toObject();
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Brokers Static Get Info', message);

        return null;
    }
};

// Model
const Index = model<IBroker, BrokerModel>('Brokers', BrokerSchema);

export default Index;
