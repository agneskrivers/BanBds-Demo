// Services
import services from '@client/services';

// Interfaces
import type {
    IProjectType,
    IPostFilterByValue,
    IApiWebRegion,
    IApiWebDistrict,
} from '@interfaces';

// Interface
interface Result {
    type?: IProjectType;
    region?: IApiWebRegion;
    district?: IApiWebDistrict;
    prices?: IPostFilterByValue;
}

// Function Type
type GetValueProjectType = (type: string) => IProjectType | undefined | null;
type GetValueProjectPrices = (
    query: string,
    value: string
) => IPostFilterByValue | null;
type GetValueProjects = (
    type: string,
    region?: string,
    district?: string,
    queryValue?: string,
    value?: string
) => Promise<Result | null>;

const getType: GetValueProjectType = (type) => {
    switch (type) {
        case 'chung-cu':
            return 'apartment';
        case 'dat-nen':
            return 'land';
        case 'bat-dong-san':
            return undefined;
        default:
            return null;
    }
};
const getPrices: GetValueProjectPrices = (query, value) => {
    if (query !== 'tren' && query !== 'duoi' && query !== 'tu') return null;

    if (query === 'duoi')
        return {
            min: 0,
            max: 5,
        };

    if (query === 'tren')
        return {
            min: 80,
            max: 0,
        };

    // ${min}-trieu-m2-den-${max}-trieu-m2

    const [min, , , , max] = value.split('-');

    if (!min || !max || isNaN(parseInt(min)) || isNaN(parseInt(max)))
        return null;

    return {
        min: parseInt(min),
        max: parseInt(max),
    };
};

const Index: GetValueProjects = async (
    type,
    region,
    district,
    queryValue,
    value
) => {
    try {
        let result: Result = {};

        const valueType = getType(type);

        if (valueType === null) return null;

        if (valueType) {
            result = { ...result, type: valueType };
        }

        if (region) {
            const resultRegion = await services.region(region);

            if (!resultRegion) return null;

            result = { ...result, region: resultRegion };

            if (district) {
                const resultDistrict = await services.district(
                    resultRegion.regionID,
                    district
                );

                if (!resultDistrict) return null;

                result = { ...result, district: resultDistrict };
            }
        }

        if ((queryValue && !value) || (!queryValue && value)) return null;

        if (queryValue && value) {
            const prices = getPrices(queryValue, value);

            if (!prices) return null;

            result = { ...result, prices };
        }

        return result;
    } catch (_) {
        return null;
    }
};

export default Index;
