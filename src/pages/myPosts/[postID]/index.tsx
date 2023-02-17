import React, { useEffect, useState, useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import classNames from 'classnames';
import ErrorComponent from 'next/error';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

// Styles
import Styles from '@client/scss/pages/myPosts/index.module.scss';

// Components
import { FormComponent, SplashComponent } from '@client/components';

// Context
import { Context } from '@client/context/Web';

// Layouts
import { WebLayout } from '@client/layouts';

// Services
import services from '@client/services';

// Interfaces
import type { NextPageWithLayout, IMyPostInfo } from '@interfaces';

// Props
type Props = Pick<IMyPostInfo, 'postID'>;

const Index: NextPageWithLayout<Props> = ({ postID }) => {
    // States
    const [data, setData] = useState<IMyPostInfo | null>(null);
    const [status, setStatus] = useState<number>();

    // Hooks
    const router = useRouter();
    const { onNotification, onLogout } = useContext(Context);

    // Effects
    useEffect(() => {
        const controller = new AbortController();

        const getData = async (signal: AbortSignal) => {
            const result = await services.posts.myInfo(signal, postID);

            if (!result) {
                setStatus(500);

                return;
            }

            if (result === 'NotFound') {
                setStatus(404);

                return;
            }

            if (result === 'Unauthorized') {
                onNotification('Vui lòng đăng nhập!', 'info');

                onLogout();

                router.push('/');

                return;
            }

            setData(result);
        };

        getData(controller.signal);

        return () => controller.abort();
    }, []);

    if (status) return <ErrorComponent statusCode={status} />;

    if (!data) return <SplashComponent />;

    return (
        <>
            <Head>
                <title>{`Chỉnh sửa tin ${data.title}`}</title>
            </Head>
            <main style={{ backgroundColor: '#f7f7f7' }}>
                <Container>
                    <Row className='justify-content-center'>
                        <Col md={8}>
                            <h2
                                className={classNames(
                                    Styles.title,
                                    'text-center'
                                )}
                            >
                                Chỉnh sửa tin đăng
                            </h2>
                            <FormComponent.Post mode='edit' data={data} />
                        </Col>
                    </Row>
                </Container>
            </main>
        </>
    );
};

Index.getLayout = (page) => <WebLayout>{page}</WebLayout>;

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    const { postID } = ctx.query;

    if (!postID || typeof postID !== 'string')
        return {
            notFound: true,
        };

    if (isNaN(parseInt(postID)))
        return {
            notFound: true,
        };

    return {
        props: {
            postID: parseInt(postID),
        },
    };
};

export default Index;
