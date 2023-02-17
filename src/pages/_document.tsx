import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class Index extends Document {
    render(): JSX.Element {
        return (
            <Html>
                <Head>
                    <link
                        href='https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap'
                        rel='stylesheet'
                    />
                    <link
                        href='https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp&display=swap'
                        rel='stylesheet'
                    />
                    <link
                        rel='icon'
                        type='image/png'
                        sizes='32x32'
                        href='/icon.png'
                    />
                    <link
                        rel='icon'
                        type='image/png'
                        sizes='96x96'
                        href='/icon.png'
                    />
                    <link
                        rel='icon'
                        type='image/png'
                        sizes='16x16'
                        href='/icon.png'
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
