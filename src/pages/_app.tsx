import React from 'react';

import type { AppProps } from 'next/app';

// Styles
import 'normalize.css/normalize.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@client/scss/index.scss';

// Interfaces
import type { NextPageWithLayout } from '@interfaces';

// Type
type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

export default function Index(props: AppPropsWithLayout) {
    // Props
    const { Component, pageProps } = props;

    const getLayout = Component.getLayout ?? ((page) => page);

    return getLayout(<Component {...pageProps} />);
}
