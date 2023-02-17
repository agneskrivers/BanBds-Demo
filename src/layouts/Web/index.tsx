import React, { FunctionComponent } from 'react';

// Components
import { FooterComponent, HeaderComponent } from '@client/components';

// Context
import Context from '@client/context/Web';

// Props
interface Props {
    children: React.ReactNode;
}

const Index: FunctionComponent<Props> = ({ children }) => (
    <Context>
        <HeaderComponent />
        {children}
        <FooterComponent />
    </Context>
);

export default Index;
