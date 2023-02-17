// Interfaces
import type { IServerGetPages } from '@interfaces';

const Index: IServerGetPages = (totals, item) =>
    totals % (item ? item : 10) === 0
        ? totals / (item ? item : 10)
        : Math.floor(totals / (item ? item : 10)) + 1;

export default Index;
