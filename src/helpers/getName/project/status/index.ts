// Type
import type { IProjectStatus } from '@interfaces';

const Index = (status: IProjectStatus): string => {
    switch (status) {
        case 'handedOver':
            return 'Đã bàn giao';
        case 'onSale':
            return 'Đang mở bán';
        case 'openingSoon':
            return 'Sắp mở bán';
    }
};

export default Index;
