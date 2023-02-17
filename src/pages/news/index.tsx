import React, { useState, useEffect, useContext } from 'react';
import ErrorComponent from 'next/error';
import Head from 'next/head';
import { Row, Col, Container, Spinner } from 'react-bootstrap';
import { GetServerSideProps } from 'next';
import InfiniteScroll from 'react-infinite-scroll-component';

// Styles
import Styles from '@client/scss/pages/news/index.module.scss';

// Components
import {
    PostComponent,
    NewsComponent,
    WidgetComponent,
    SplashComponent,
} from '@client/components';

// Context
import { Context } from '@client/context/Web';

// Layouts
import { WebLayout } from '@client/layouts';

// Services
import services from '@client/services';

// Interfaces
import type {
    NextPageWithLayout,
    IPropsSeverSide,
    IApiWebNewsShortlist,
    INewsCompactModeSmallForWeb,
    INewsCompactModeTitleForWeb,
    INewsCompactForWeb,
} from '@interfaces';

// Props
type Props = IPropsSeverSide<IApiWebNewsShortlist>;

const Index: NextPageWithLayout<Props> = (props) => {
    // States
    const [isLoadMore, setIsLoadMore] = useState<boolean>(false);

    const [hot, setHot] = useState<INewsCompactModeSmallForWeb[] | null>(null);
    const [mostViews, setMostViews] = useState<
        INewsCompactModeTitleForWeb[] | null
    >(null);
    const [data, setData] = useState<INewsCompactForWeb[] | null>(null);

    const [pages, setPages] = useState<number>(0);
    const [page, setPage] = useState<number>(1);

    // Hooks
    const { onNotification } = useContext(Context);

    // Effects
    useEffect(() => {
        if (props.status === 'success') {
            setData(props.news.latests);

            if (props.news.mode === 'first') {
                setHot(props.news.top);
                setMostViews(props.news.mostViews);
                setPages(props.news.pages);
            }
        }
    }, []);
    useEffect(() => {
        const controller = new AbortController();

        const getData = async (signal: AbortSignal) => {
            let list: number[] = [];

            if (hot && mostViews) {
                list = [
                    ...[...hot].map((item) => item.newsID),
                    ...[...mostViews].map((item) => item.newsID),
                ];
            }

            const result = await services.news.shortlist(
                page + 1,
                list,
                signal
            );

            if (!result) throw new Error();

            if (result === 'BadRequest' || result.news.mode !== 'more') {
                setIsLoadMore(false);

                onNotification(
                    'Lấy danh sách tin tức không thành công. Vui lòng thử lại!',
                    'warning'
                );

                return;
            }

            setIsLoadMore(false);
            setData((preData) => [
                ...(preData ? preData : []),
                ...result.news.latests,
            ]);
        };

        if (isLoadMore && pages > page) {
            getData(controller.signal)
                .then(() => setPage((prePage) => prePage + 1))
                .catch(() => {
                    setIsLoadMore(false);

                    onNotification(
                        'Máy chủ bị lỗi. Vui lòng thử lại sau!',
                        'danger'
                    );
                });
        } else {
            setIsLoadMore(false);
        }

        return () => controller.abort();
    }, [isLoadMore]);

    // Handles
    const handleLoadMore = () => {
        if (pages > page) return setIsLoadMore(true);
    };

    if (props.status === 'error') return <ErrorComponent statusCode={500} />;

    if (!data) return <SplashComponent />;

    return (
        <>
            <Head>
                <title>Tin tức - BanBds</title>
            </Head>
            <main>
                <Container>
                    <Row className='justify-content-evenly'>
                        <Col md={props.posts ? 8 : 10}>
                            {hot && mostViews && (
                                <Row>
                                    <Col lg={8}>
                                        <NewsComponent
                                            mode='small'
                                            data={hot[0]}
                                            height={300}
                                        />
                                        <Row>
                                            <Col lg={6}>
                                                <NewsComponent
                                                    mode='small'
                                                    data={hot[1]}
                                                />
                                            </Col>
                                            <Col lg={6}>
                                                <NewsComponent
                                                    mode='small'
                                                    data={hot[1]}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col lg={4} className={Styles.mostViews}>
                                        <p className={Styles.mostViews_title}>
                                            Xem nhiều
                                        </p>
                                        <div
                                            className={Styles.mostViews_content}
                                        >
                                            {mostViews.map((item) => (
                                                <NewsComponent
                                                    key={item.id}
                                                    mode='title'
                                                    data={item}
                                                />
                                            ))}
                                        </div>
                                    </Col>
                                </Row>
                            )}
                            <InfiniteScroll
                                dataLength={data.length}
                                next={handleLoadMore}
                                hasMore={pages > page}
                                loader={
                                    <div className='d-flex justify-content-center align-items-center pt-4 pb-4'>
                                        <Spinner
                                            animation='border'
                                            variant='primary'
                                        />
                                    </div>
                                }
                            >
                                {data.map((item) => (
                                    <NewsComponent
                                        key={item.id}
                                        mode='normal'
                                        data={item}
                                    />
                                ))}
                            </InfiniteScroll>
                        </Col>
                        {props.posts && (
                            <Col md={3}>
                                {props.posts.rent && (
                                    <WidgetComponent title='Cho thuê'>
                                        {[...props.posts.rent].map((item) => (
                                            <PostComponent
                                                key={item.id}
                                                mode='vertical'
                                                data={item}
                                            />
                                        ))}
                                    </WidgetComponent>
                                )}
                                {props.posts.sell && (
                                    <WidgetComponent title='Mua bán'>
                                        {[...props.posts.sell].map((item) => (
                                            <PostComponent
                                                key={item.id}
                                                mode='vertical'
                                                data={item}
                                            />
                                        ))}
                                    </WidgetComponent>
                                )}
                            </Col>
                        )}
                    </Row>
                </Container>
            </main>
        </>
    );
};

Index.getLayout = (page) => <WebLayout>{page}</WebLayout>;

export const getServerSideProps: GetServerSideProps<Props> = async () => {
    const data = await services.news.shortlist(1);

    if (!data)
        return {
            props: {
                status: 'error',
            },
        };

    if (data === 'BadRequest')
        return {
            notFound: true,
        };

    return {
        props: {
            status: 'success',
            ...data,
        },
    };
};

export default Index;
