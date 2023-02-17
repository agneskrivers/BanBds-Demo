import imageSize from 'image-size';
import { promisify } from 'util';

import type { ISizeCalculationResult } from 'image-size/dist/types/interface';

// Helpers
import { handleError } from '@server/helpers';

// Function Type
type CommonUtilImageSize = (
    imagePath: string
) => Promise<ISizeCalculationResult | null | undefined>;

// Create a cache to store the dimensions of previously read images
const dimensionsCache = new Map<string, ISizeCalculationResult | null>();

const Index: CommonUtilImageSize = async (imagePath) => {
    try {
        if (dimensionsCache.has(imagePath))
            return dimensionsCache.get(imagePath);

        const dimensions = await promisify(imageSize)(imagePath);

        dimensionsCache.set(imagePath, dimensions ? dimensions : null);

        if (!dimensions) return null;

        return dimensions;
    } catch (error) {
        const { message } = error as Error;

        handleError('Common Util Image Size', message);

        return null;
    }
};

export default Index;
