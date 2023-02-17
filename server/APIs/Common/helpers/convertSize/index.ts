import fs from 'fs/promises';
import sharp from 'sharp';
import path from 'path';

// Configs
import { pathTemp } from '@server/configs';

// Helpers
import { handleError } from '@server/helpers';

// Utils
import { imageSize } from '@server/utils/Common';

// Interfaces
import type { IServerCommonConvertSize } from '@interfaces';

const Index: IServerCommonConvertSize = async (pathFile, isAvatar) => {
    try {
        const fileName = path.basename(pathFile);
        const [name, ext] = fileName.split('.');

        const dimensions = await imageSize(pathFile);

        let convertWidth, convertHeight;

        if (dimensions) {
            // Calculate the new width and height
            convertWidth = dimensions.width
                ? Math.floor(dimensions.width * 0.8)
                : null;
            convertHeight = dimensions.height
                ? Math.floor(dimensions.height * 0.8)
                : null;
        }

        // Resize and convert the image
        let result = sharp(pathFile);

        if (isAvatar) {
            result = result.resize({
                width: 300,
                height: 300,
                fit: sharp.fit.cover,
                position: sharp.strategy.entropy,
            });
        } else if (convertWidth && convertHeight) {
            result = result.resize(convertWidth, convertHeight);
        }

        if (ext === 'jpeg') {
            result = result.png({ quality: 90 });
        } else {
            result = result.jpeg({ quality: 90 });
        }

        // Write the result to a file in the temporary directory
        await result.toFile(
            path.join(pathTemp, `${name}.${ext === 'jpeg' ? 'png' : 'jpeg'}`)
        );

        // Delete the original file
        await fs.unlink(pathFile);

        return `${name}.${ext === 'jpeg' ? 'png' : 'jpeg'}`;
    } catch (error) {
        const { message } = error as Error;

        handleError('Common Helper Convert Size', message);

        return null;
    }
};

export default Index;
