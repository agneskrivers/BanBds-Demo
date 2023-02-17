// Services
import services from '@client/services';

// Interfaces
import type {
    IPostType,
    IPostCategory,
    IPostFilterByValue,
    IApiWebDistrict,
    IApiWebRegion,
} from '@interfaces';

// Interfaces
interface ResultGetValuePostQuery {
    prices: IPostFilterByValue | null;
    acreages: IPostFilterByValue | null;
}
interface ResultGetValuePost {
    type: IPostType;
    category?: IPostCategory;
    region?: IApiWebRegion;
    district?: IApiWebDistrict;
    prices?: IPostFilterByValue;
    acreages?: IPostFilterByValue;
}

// Function Type
type GetValuePostType = (type: string) => IPostType | null;
type GetValuePostCategory = (
    category: string
) => IPostCategory | undefined | null;
type GetValuePostQuery = (
    type?: string,
    valueType?: string,
    value?: string
) => ResultGetValuePostQuery | undefined | null;
type GetValuePost = (
    type: string,
    category?: string,
    region?: string,
    district?: string,
    queryType?: string,
    queryValueType?: string,
    queryValue?: string
) => Promise<ResultGetValuePost | null>;

const getType: GetValuePostType = (type) => {
    switch (type) {
        case 'ban':
            return 'sell';
        case 'cho-thue':
            return 'rent';
        default:
            return null;
    }
};
const getCategory: GetValuePostCategory = (category) => {
    switch (category) {
        case 'chung-cu':
            return 'apartment';
        case 'nha-rieng':
            return 'house';
        case 'dat-nen':
            return 'soil';
        case 'bat-dong-san':
            return undefined;
        default:
            return null;
    }
};
const getQuery: GetValuePostQuery = (type, valueType, value) => {
    if (!type || !valueType || !value) return undefined;

    let prices: IPostFilterByValue | null = null;
    let acreages: IPostFilterByValue | null = null;

    if (type === 'dien-tich') {
        if (valueType === 'duoi')
            return {
                prices,
                acreages: {
                    min: 0,
                    max: 30,
                },
            };

        if (valueType === 'tren')
            return {
                prices,
                acreages: {
                    min: 1000,
                    max: 0,
                },
            };

        if (valueType !== 'tu') return null;

        const [acreagesMin, , , acreagesMax] = value.split('-');

        if (
            !acreagesMin ||
            !acreagesMax ||
            isNaN(parseInt(acreagesMin)) ||
            isNaN(parseInt(acreagesMax))
        )
            return null;

        const min = parseInt(acreagesMin);
        const max = parseInt(acreagesMax);

        return {
            prices,
            acreages: { min, max },
        };
    }

    if (valueType !== 'duoi' && valueType !== 'tren' && valueType !== 'tu')
        return null;

    if (valueType === 'duoi') {
        prices = {
            min: 0,
            max: 500,
        };
    }

    if (valueType === 'tren') {
        prices = {
            min: 60000,
            max: 0,
        };
    }

    const [queryPrices, queryAcreages] = value.split('-dien-tich-');

    if (valueType === 'tu') {
        const [pricesMin, unitMin, , pricesMax, unitMax] =
            queryPrices.split('-');

        if (
            !pricesMin ||
            !pricesMax ||
            isNaN(parseInt(pricesMin)) ||
            isNaN(parseInt(pricesMax))
        )
            return null;

        const min = parseInt(pricesMin) * (unitMin === 'ty' ? 1000 : 1);
        const max = parseInt(pricesMax) * (unitMax === 'ty' ? 1000 : 1);

        prices = {
            min,
            max,
        };
    }

    if (queryAcreages) {
        const [acreagesType, acreagesMin, , , acreagesMax] =
            queryAcreages.split('-');

        if (
            acreagesType !== 'duoi' &&
            acreagesType !== 'tren' &&
            acreagesType !== 'tu'
        )
            return null;

        if (acreagesType === 'duoi') {
            acreages = {
                min: 0,
                max: 30,
            };
        }

        if (acreagesType === 'tren') {
            acreages = {
                min: 1000,
                max: 0,
            };
        }

        if (acreagesType === 'tu') {
            if (
                !acreagesMin ||
                !acreagesMax ||
                isNaN(parseInt(acreagesMin)) ||
                isNaN(parseInt(acreagesMax))
            )
                return null;

            acreages = {
                min: parseInt(acreagesMin),
                max: parseInt(acreagesMax),
            };
        }
    }

    return {
        acreages,
        prices,
    };
};

const Index: GetValuePost = async (
    type,
    category,
    region,
    district,
    queryType,
    queryValueType,
    queryValue
) => {
    try {
        const valueType = getType(type);

        if (!valueType) return null;

        let result: ResultGetValuePost = { type: valueType };

        if (category) {
            const valueCategory = getCategory(category);

            if (valueCategory === null) return null;

            if (valueCategory) {
                result = { ...result, category: valueCategory };
            }
        }

        if (region) {
            const valueRegion = await services.region(region);

            if (!valueRegion) return null;

            result = { ...result, region: valueRegion };

            if (district) {
                const valueDistrict = await services.district(
                    valueRegion.regionID,
                    district
                );

                if (!valueDistrict) return null;

                result = { ...result, district: valueDistrict };
            }
        }

        const valueQuery = getQuery(queryType, queryValueType, queryValue);

        if (valueQuery === null) return null;

        if (valueQuery) {
            const { acreages, prices } = valueQuery;

            if (acreages) {
                result = { ...result, acreages };
            }

            if (prices) {
                result = { ...result, prices };
            }
        }

        return result;
    } catch (_) {
        return null;
    }
};

export default Index;
