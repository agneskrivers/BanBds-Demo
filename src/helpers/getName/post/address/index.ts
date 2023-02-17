const Index = (address: string): string =>
    address.split(', ').slice(0, -3).join(', ');

export default Index;
