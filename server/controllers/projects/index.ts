import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import fs from 'fs';
import path from 'path';

// Configs
import { pathTemp, pathImages } from '@server/configs';

// Interfaces
import type { ResJSON } from '@interfaces';

// Request Interface
interface ReqParams {
    image: string;
}

// Function Type
type ControllerProjects = (
    req: Request<ReqParams>,
    res: Response<ResJSON>
) => void;

const Index: ControllerProjects = (req, res) => {
    const { image } = req.params;

    const ext = path.extname(image).replace('.', '');

    let pathImage: string | null = null;

    const pathImageTemp = path.join(pathTemp, image);
    const pathImageNews = path.join(pathImages, 'projects', image);

    if (fs.existsSync(pathImageNews)) {
        pathImage = pathImageNews;
    } else if (fs.existsSync(pathImageTemp)) {
        pathImage = pathImageTemp;
    }

    if (!pathImage) {
        const { status, message } = new createHttpError.NotFound();

        res.status(status).json({ status: 'Not Process', message });

        return;
    }

    const file = fs.createReadStream(pathImage);

    file.on('open', () => {
        res.set('Content-Type', `image/${ext}`);

        file.pipe(res);
    });
    file.on('error', () => {
        const { status, message } = new createHttpError.NotFound();

        res.status(status).json({ status: 'Not Process', message });
    });
};

export default Index;
