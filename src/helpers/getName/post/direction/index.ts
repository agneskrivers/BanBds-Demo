// Interfaces
import type { IPostDirection } from '@interfaces';

const Index = (direction: IPostDirection): string => {
    switch (direction) {
        case 'east':
            return 'Đông';
        case 'north':
            return 'Bắc';
        case 'south':
            return 'Nam';
        case 'west':
            return 'Tây';
        case 'northeast':
            return 'Đông Bắc';
        case 'northwest':
            return 'Tây Bắc';
        case 'southeast':
            return 'Đông Nam';
        case 'southwest':
            return 'Tây Nam';
    }
};

export default Index;
