import { model, Model, Schema } from 'mongoose';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';

// Config
import { pathPublic, pathTemp, pathImages } from '@server/configs';

// Helpers
import { handleError } from '@server/helpers';

// Interfaces
import type { IImage, IImagePathType } from '@interfaces';

// Model Interface
interface ImageModel extends Model<IImage> {
    createImg(img: IImage, path: IImagePathType): Promise<boolean>;
    removeImg(
        fileName: string,
        userID: number,
        type: IImagePathType,
        id?: number
    ): Promise<boolean>;
}

// Schema
const ImageSchema = new Schema<IImage, ImageModel>(
    {
        fileName: {
            type: String,
            required: true,
            immutable: true,
            unique: true,
        },
        userID: { type: Number, required: true },
        news: Number,
        posts: Number,
        projects: Number,
    },
    {
        timestamps: false,
    }
);

// Statics
ImageSchema.statics.createImg = async function (
    img: IImage,
    type: IImagePathType
): Promise<boolean> {
    const pathDir = path.join(pathImages, type);

    const pathImage = path.join(pathDir, `${img.fileName}`);
    const pathImageTemp = path.join(pathTemp, `${img.fileName}`);

    try {
        if (fs.existsSync(pathImage)) return true;

        if (!fs.existsSync(pathImageTemp)) return false;

        if (!fs.existsSync(pathPublic)) {
            fs.mkdirSync(pathPublic);
        }

        if (!fs.existsSync(pathImages)) {
            fs.mkdirSync(pathImages);
        }

        if (!fs.existsSync(pathDir)) {
            fs.mkdirSync(pathDir);
        }

        const image = new this(img);

        await image.save();
        await fsPromises.rename(pathImageTemp, pathImage);

        return true;
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Images Static Create', message);

        return false;
    }
};
ImageSchema.statics.removeImg = async function (
    fileName: string,
    userID: number,
    type: IImagePathType,
    id?: number
): Promise<boolean> {
    try {
        const image = await this.findOne({ fileName, userID });

        if (!image) return true;

        if (type === 'news' || !image.news || !id || image.news !== id)
            return false;

        if (type === 'posts' || !image.posts || !id || image.posts !== id)
            return false;

        if (
            type === 'projects' ||
            !image.projects ||
            !id ||
            image.projects !== id
        )
            return false;

        const pathImage = path.join(pathPublic, type, fileName);

        if (fs.existsSync(pathImage)) {
            fs.unlinkSync(pathImage);
        }

        await image.remove();

        return true;
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Images Static Remove', message);

        return false;
    }
};

// Model
const Index = model<IImage, ImageModel>('Images', ImageSchema);

export default Index;
