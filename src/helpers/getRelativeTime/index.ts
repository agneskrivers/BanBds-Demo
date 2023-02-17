import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const Index = (date: number): string =>
    dayjs(date)
        .fromNow()
        .replace(/^\w/, (c) => c.toUpperCase());

export default Index;
