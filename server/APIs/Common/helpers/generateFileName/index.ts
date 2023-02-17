import fs from 'fs';
import crypto from 'crypto';
import uniqid from 'uniqid';
import path from 'path';

// Configs
import { pathPublic, pathTemp } from '@server/configs';

// Interfaces
import type { IServerCommonGenerateFileName } from '@interfaces';

const Index: IServerCommonGenerateFileName = (fileName) => {
    const [name, ext] = fileName.split('.');

    const id = uniqid();

    const hash = crypto.createHash('md5').update(`${name}-${id}`).digest('hex');

    const result = `${hash}.${ext}`;

    const pathImageTemp = path.join(pathTemp, result);
    const pathImageAvatar = path.join(pathPublic, 'avatars', result);
    const pathImagePost = path.join(pathPublic, 'posts', result);
    const pathImageProjects = path.join(pathPublic, 'projects', result);
    const pathImageNews = path.join(pathPublic, 'news', result);

    if (fs.existsSync(pathImageTemp)) return Index(fileName);
    if (fs.existsSync(pathImageAvatar)) return Index(fileName);
    if (fs.existsSync(pathImageNews)) return Index(fileName);
    if (fs.existsSync(pathImagePost)) return Index(fileName);
    if (fs.existsSync(pathImageProjects)) return Index(fileName);

    return result;
};

export default Index;
