// Interfaces
import type { IPostStatus } from '@interfaces';

const Index = (status: IPostStatus): string => {
    switch (status) {
        case 'accept':
            return 'Phê duyệt';
        case 'pending':
            return 'Chờ kiểm duyệt';
        case 'sold':
            return 'Đã bán';
    }
};

export default Index;
