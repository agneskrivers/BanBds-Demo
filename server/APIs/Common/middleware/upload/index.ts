import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Configs
import { pathTemp, ValidExtname } from '@server/configs';

// Helpers
import { generateFileName } from '@server/helpers/Common';

// Interfaces
import type { ResUploadImageJSON } from '@interfaces';

// Function Type
type CommonMiddlewareUpload = (
    req: Request,
    res: Response<ResUploadImageJSON>,
    next: NextFunction
) => void;

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        if (!fs.existsSync(pathTemp)) {
            fs.mkdirSync(pathTemp, { recursive: true });
        }

        cb(null, pathTemp);
    },
    filename: (_req, file, cb) => {
        const name = generateFileName(file.originalname);

        cb(null, name);
    },
});

const upload = multer({
    storage,
    fileFilter: (_req, file, cb) => {
        const ext = path.extname(file.originalname);

        if (ValidExtname.indexOf(ext) < 0)
            return cb(new Error('Invalid format!'));

        cb(null, true);
    },
    limits: {
        fieldNameSize: 100,
        fileSize: 10485760,
    },
}).single('file');

const Index: CommonMiddlewareUpload = (req, res, next) => {
    upload(req, res, (error) => {
        if (error instanceof multer.MulterError) {
            res.status(202).json({ status: 'ImageToBig' });

            return;
        } else if (error) {
            res.status(202).json({ status: 'ImageFormat' });

            return;
        }

        next();
    });
};

export default Index;
