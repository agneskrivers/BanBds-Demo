import fs from 'fs/promises';
import convert from 'heic-convert';
import path from 'path';
import { Buffer } from 'buffer';

// Configs
import { pathTemp } from '@server/configs';

// Helpers
import { handleError } from '@server/helpers';

// Interfaces
import type { IServerCommonConvertHEIC } from '@interfaces';

const Index: IServerCommonConvertHEIC = async (fileName) => {
    try {
        const [name] = fileName.split('.');

        const result = `${name}.png`;

        const pathImageTemp = path.join(pathTemp, fileName);
        const pathImageConvertTemp = path.join(pathTemp, result);

        const inputBuffer = await fs.readFile(pathImageTemp);
        const outputBuffer = await convert({
            buffer: inputBuffer,
            format: 'PNG',
        });

        await fs.writeFile(pathImageConvertTemp, Buffer.from(outputBuffer));
        await fs.unlink(pathImageTemp);

        return result;
    } catch (error) {
        const { message } = error as Error;

        handleError('Common Helper Convert HEIC', message);

        return null;
    }
};

export default Index;
