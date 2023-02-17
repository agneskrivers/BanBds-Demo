const formatNumber = (num: number): number => Math.floor(num * 100) / 100;

const Index = (acreage: number, price: number): string => {
    const result = price / acreage;

    return `${formatNumber(
        result >= 1000 ? result / 1000 : result >= 1 ? result : result * 1000
    )} ${result >= 1000 ? 'Tỷ/m²' : result >= 1 ? 'Triệu/m²' : 'Ngàn/m²'}`;
};

export default Index;
