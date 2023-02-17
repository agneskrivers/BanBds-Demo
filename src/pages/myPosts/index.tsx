import React, { useState, useEffect, useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import ErrorComponent from 'next/error';
import InfiniteScroll from 'react-infinite-scroll-component';
import Head from 'next/head';
import { useRouter } from 'next/router';

// Styles
import Styles from '@client/scss/pages/myPosts/index.module.scss';

// Components
import { PostComponent, SplashComponent } from '@client/components';

// Context
import { Context } from '@client/context/Web';

// Helpers
import { getName } from '@client/helpers';

// Layouts
import { WebLayout } from '@client/layouts';

// Services
import services from '@client/services';

// Interfaces
import type {
    NextPageWithLayout,
    IPostStatus,
    IPostCompactModeEditorForWeb,
} from '@interfaces';

const Index: NextPageWithLayout = () => {
    // States
    const [isLoaded, setIsLoaded] = useState<boolean | null>(false);
    const [isLoadMore, setIsLoadMore] = useState<boolean | null>(false);

    const [status, setStatus] = useState<IPostStatus>();
    const [data, setData] = useState<IPostCompactModeEditorForWeb[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pages, setPages] = useState<number>(0);

    const [postRemove, setPostRemove] = useState<number>();

    // Hooks
    const router = useRouter();
    const { onNotification, onLogout } = useContext(Context);

    // Effects
    useEffect(() => {
        const controller = new AbortController();

        const getData = async (signal: AbortSignal) => {
            const result = await services.posts.myShortlist(signal, 1);

            if (!result) throw new Error();

            if (result === 'NotFound') {
                setIsLoaded(true);

                return;
            }

            if (result === 'Unauthorized') {
                onLogout();

                onNotification('Bạn không có quyền!', 'danger');

                router.push('/');

                return;
            }

            setData(result.posts);
            setPages(result.pages);
            setIsLoaded(true);
        };

        getData(controller.signal).catch(() => {
            setIsLoaded(null);

            onNotification('Máy chủ bị lỗi. Vui lòng thử lại!', 'danger');
        });

        return () => controller.abort();
    }, []);
    useEffect(() => {
        const controller = new AbortController();

        const getData = async (signal: AbortSignal) => {
            const result = await services.posts.myShortlist(signal, 1, status);

            if (!result) throw new Error();

            if (result === 'NotFound') return;

            if (result === 'Unauthorized') {
                onLogout();

                onNotification('Bạn không có quyền!', 'danger');

                router.push('/');

                return;
            }

            setData(result.posts);
            setPages(result.pages);
        };

        getData(controller.signal).catch(() => {
            onNotification('Máy chủ bị lỗi. Vui lòng thử lại!', 'danger');
        });

        return () => controller.abort();
    }, [status]);
    useEffect(() => {
        const controller = new AbortController();

        const getData = async (signal: AbortSignal) => {
            const result = await services.posts.myShortlist(
                signal,
                page + 1,
                status
            );

            if (!result) throw new Error();

            if (result === 'NotFound') {
                setIsLoadMore(false);

                return;
            }

            if (result === 'Unauthorized') {
                setIsLoadMore(false);

                onLogout();

                onNotification('Bạn không có quyền!', 'danger');

                router.push('/');

                return;
            }

            setIsLoadMore(false);
            setData((preData) => [...preData, ...result.posts]);
        };

        if (isLoadMore && pages > page) {
            getData(controller.signal)
                .then(() => setPage((prePage) => prePage + 1))
                .catch(() => {
                    setIsLoadMore(false);

                    onNotification(
                        'Máy chủ bị lỗi. Vui lòng thử lại!',
                        'danger'
                    );
                });
        } else {
            setIsLoadMore(false);
        }

        return () => controller.abort();
    }, [isLoadMore]);
    useEffect(() => {
        const controller = new AbortController();

        const getData = async (signal: AbortSignal, postID: number) => {
            const result = await services.posts.remove(signal, postID);

            if (!result) throw new Error();

            if (result === 'Unauthorized') {
                setPostRemove(undefined);

                onLogout();

                onNotification('Bạn không có quyền!', 'danger');

                router.push('/');

                return;
            }

            if (result === 'NotFound') {
                setPostRemove(undefined);

                onNotification('Không tìm thấy tin đăng!', 'warning');

                return;
            }

            if (result === 'BadRequest') {
                setPostRemove(undefined);

                onNotification(
                    'Xóa tin không thành công. Vui lòng thử lại!',
                    'warning'
                );

                return;
            }

            const updateData = [...data].filter(
                (item) => item.postID !== postID
            );

            setData(updateData);
            setPostRemove(undefined);

            onNotification('Xóa tin thành công!', 'success');
        };

        if (postRemove) {
            getData(controller.signal, postRemove).catch(() => {
                setPostRemove(undefined);

                onNotification('Máy chủ bị lỗi. Vui lòng thử lại!', 'danger');
            });
        }

        return () => controller.abort();
    }, [postRemove]);

    // Handles
    const handleLoadMore = () => {
        if (pages > page) return setIsLoadMore(true);
    };
    const handleRemove = (postID: number) => setPostRemove(postID);

    const handleClickStatus = (value?: IPostStatus) => {
        if (value !== status) return setStatus(value);
    };

    if (isLoaded === null) return <ErrorComponent statusCode={500} />;

    if (isLoaded === false) return <SplashComponent />;

    return (
        <>
            <Head>
                <title>
                    {`Quản lý ${!status ? 'tất cả' : ''} tin ${
                        status
                            ? getName.post.status(status).toLowerCase()
                            : 'đăng'
                    } - BanBds`}
                </title>
            </Head>
            <main>
                <Container>
                    <h2 className={Styles.title}>
                        {`Quản lý ${!status ? 'tất cả' : ''} tin ${
                            status
                                ? getName.post.status(status).toLowerCase()
                                : 'đăng'
                        }`}
                    </h2>
                    <Row>
                        <Col md={8}>
                            <InfiniteScroll
                                className='overflow-hidden p-2'
                                dataLength={data.length}
                                hasMore={pages > page}
                                loader={
                                    <div className='d-flex justify-content-center align-items-center pt-2 pb-2'>
                                        <Spinner
                                            animation='border'
                                            variant='primary'
                                        />
                                    </div>
                                }
                                next={handleLoadMore}
                            >
                                {data.map((item) => (
                                    <PostComponent
                                        key={item.id}
                                        mode='editor'
                                        data={item}
                                        postID={postRemove}
                                        onRemove={handleRemove}
                                    />
                                ))}
                            </InfiniteScroll>
                        </Col>
                        <Col md={4} className='d-none d-md-block'>
                            <div className={Styles.box}>
                                <button
                                    className={Styles.box_item}
                                    onClick={() => handleClickStatus()}
                                >
                                    Tất cả
                                </button>
                                <button
                                    className={Styles.box_item}
                                    onClick={() => handleClickStatus('accept')}
                                >
                                    Tin đã duyệt
                                </button>
                                <button
                                    className={Styles.box_item}
                                    onClick={() => handleClickStatus('pending')}
                                >
                                    Tin chờ duyệt
                                </button>
                                <button
                                    className={Styles.box_item}
                                    onClick={() => handleClickStatus('sold')}
                                >
                                    Tin đã bán
                                </button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </main>
        </>
    );
};

Index.getLayout = (page) => <WebLayout>{page}</WebLayout>;

export default Index;
