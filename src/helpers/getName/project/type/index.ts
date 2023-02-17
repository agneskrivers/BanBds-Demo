// Interfaces
import type { IProjectType } from '@interfaces';

const Index = (type: IProjectType): string =>
    type === 'apartment' ? 'Chung cư' : 'Đất nền';

export default Index;
