// Interfaces
import type { IPostCategory } from '@interfaces';

const Index = (category: IPostCategory): string => {
    switch (category) {
        case 'apartment':
            return 'Chung cư';
        case 'house':
            return 'Nhà riêng';
        case 'soil':
            return 'Đất nền';
    }
};

export default Index;
