// Helpers
import { convertToEnglish, getName } from '@client/helpers';

// Interfaces
import type { IPostFilterByValue, IProjectType } from '@interfaces';

// Function Type
type GetLinkProject = (
    type?: IProjectType,
    region?: string,
    district?: string,
    prices?: IPostFilterByValue,
    search?: string
) => string;

const convertStr = (str: string): string =>
    convertToEnglish(str).replace(/\s/g, '-');

const Index: GetLinkProject = (type, region, district, prices, search) => {
    let result = '/du-an-bat-dong-san';

    if (type) {
        result = `/du-an-${convertStr(getName.project.t(type))}`;
    }

    if (region) {
        const convertRegion = convertStr(region);

        result += `/${convertRegion}`;

        if (district) {
            const convertDistrict = convertStr(district);

            result += `/${convertDistrict}`;
        }
    }

    if (prices) {
        const { max, min } = prices;

        if (min === 0) {
            result += '/gia-duoi-5-trieu-m2';
        } else if (max === 0) {
            result += '/gia-tren-80-trieu-m2';
        } else {
            result += `/gia-tu-${min}-trieu-m2-den-${max}-trieu-m2`;
        }
    }

    if (search) {
        result += `?s=${search}`;
    }

    return result;
};

export default Index;
