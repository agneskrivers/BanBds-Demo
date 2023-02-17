import crypto from 'crypto';

// Helpers
import { handleError } from '@server/helpers';

// Types
type InitialID = (length: number) => Promise<number | null>;

const Index: InitialID = async (length: number) => {
    try {
        const min = parseInt([1, ...Array(length - 1).fill(0)].join(''));
        const max = parseInt([1, 5, ...Array(length - 2).fill(0)].join(''));

        const result = await crypto.randomInt(min, max);

        return result;
    } catch (error) {
        const { message } = error as Error;

        handleError('Helper Generate ID Initial', message);

        return null;
    }
};

export default Index;
