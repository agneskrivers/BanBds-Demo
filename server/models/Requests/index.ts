import { model, Model, Schema } from 'mongoose';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { UsersModel } from '@server/models';

// Interfaces
import type { IRequest, IRequestCreate, IRequestInfo } from '@interfaces';

// Model Interface
interface RequestModel extends Model<IRequest> {
    createRequest(data: IRequestCreate): Promise<boolean>;
    getInfo(id: string): Promise<IRequestInfo | null>;
}

// Schema
const RequestSchema = new Schema<IRequest, RequestModel>(
    {
        content: { type: String, required: true },
        region: { type: String, required: true },
        district: { type: String, required: true },
        ward: { type: String, required: true },
        min: { type: Number, required: true },
        max: { type: Number, required: true },
        userID: { type: Number, required: true },
        status: {
            type: String,
            enum: ['pending', 'accept'],
            default: 'pending',
        },
        editor: { type: String, default: null },
    },
    {
        timestamps: true,
    }
);

// Statics
RequestSchema.statics.createRequest = async function (
    data: IRequestCreate
): Promise<boolean> {
    try {
        const user = await UsersModel.findOne({ userID: data.userID });

        if (!user) return false;

        const isAdd = await user.addRequest('pending');

        if (!isAdd) return false;

        const request = new this(data);

        await request.save();

        return true;
    } catch (error) {
        const { message } = error as Error;

        handleError('Mode Requests Static Create', message);

        return false;
    }
};

// Models
const Index = model<IRequest, RequestModel>('Requests', RequestSchema);

export default Index;
