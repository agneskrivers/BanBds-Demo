// Helpers
import { convertToEnglish, getName } from '@client/helpers';

// Interfaces
import type { IPostFilterByValue, IPostCategory, IPostType } from '@interfaces';

// Function Type
type GetLinkPost = (
    type: IPostType,
    category?: IPostCategory,
    region?: string,
    district?: string,
    prices?: IPostFilterByValue,
    acreages?: IPostFilterByValue,
    search?: string
) => string;

const convertStr = (str: string): string =>
    convertToEnglish(str).replace(/\s/g, '-');

const Index: GetLinkPost = (
    type,
    category,
    region,
    district,
    prices,
    acreages,
    search
) => {
    let result = type === 'sell' ? 'ban' : 'cho-thue';

    if (category) {
        const str = convertStr(getName.post.category(category));

        result += `-${str}`;
    } else {
        result += '-bat-dong-san';
    }

    if (region) {
        if (district) {
            const strRegion = convertStr(region);
            const strDistrict = convertStr(district);

            result += `/${strRegion}/${strDistrict}`;
        } else {
            const str = convertStr(region);

            result += `/${str}`;
        }
    }

    if (prices) {
        if (prices.max === 0) {
            result += '/gia-tren-60-ty';
        } else if (prices.min === 0) {
            result += '/gia-duoi-500-trieu';
        } else {
            const { min, max } = prices;

            const pricesMin = min >= 1000 ? min / 1000 : min;
            const pricesMax = max >= 1000 ? max / 1000 : max;

            const unitMin = min >= 1000 ? 'ty' : 'trieu';
            const unitMax = max >= 1000 ? 'ty' : 'trieu';

            result += `/gia-tu-${pricesMin}-${unitMin}-den-${pricesMax}-${unitMax}`;
        }
    }

    if (acreages) {
        result += prices ? '-dien-tich-' : '/dien-tich-';

        if (acreages.min === 0) {
            result += 'duoi-30-m2';
        } else if (acreages.max === 0) {
            result += 'tren-1000-m2';
        } else {
            result += `tu-${acreages.min.toLocaleString(
                'en'
            )}-m2-den-${acreages.max.toLocaleString('en')}-m2`;
        }
    }

    if (search) {
        result += `?s=${search}`;
    }

    return result;
};

export default Index;
