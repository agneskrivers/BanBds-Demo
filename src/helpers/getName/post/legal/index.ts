// Interfaces
import type { IPostLegal } from '@interfaces';

const Index = (legal: IPostLegal): string => {
    switch (legal) {
        case 'book':
            return 'Sổ đỏ/Sổ hồng';
        case 'saleContract':
            return 'Hợp đồng mua bán';
        case 'waitingForBook':
            return 'Đang chờ sổ';
    }
};

export default Index;
