// Interfaces
import type { IServerHandleError } from '@interfaces';

const Index: IServerHandleError = (location, error) => {
    console.log(`${location} Error: ${error}`);
};

export default Index;
