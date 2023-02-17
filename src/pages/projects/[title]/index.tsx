import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tooltip from 'react-bootstrap/Tooltip';
import Carousel from 'react-bootstrap/Carousel';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Modal from 'react-bootstrap/Modal';
import Image from 'next/image';
import ErrorComponent from 'next/error';
import Head from 'next/head';
import { GetServerSideProps } from 'next';

// Styles
import Styles from '@client/scss/pages/project/index.module.scss';

// Components
import {
    MapComponent,
    WidgetComponent,
    PostComponent,
} from '@client/components';

// Helpers
import { getName } from '@client/helpers';

// Layouts
import { WebLayout } from '@client/layouts';

// Services
import services from '@client/services';

// Interfaces
import type {
    NextPageWithLayout,
    IApiWebProjectInfo,
    IPropsSeverSide,
    IClientLocalStorage,
} from '@interfaces';

// Interface
interface PropsResult extends IApiWebProjectInfo {
    projectID: number;
}

// Props
type Props = IPropsSeverSide<PropsResult>;

const Index: NextPageWithLayout<Props> = (props) => {
    // States
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [isModalMap, setIsModalMap] = useState<boolean>(false);

    // Effects
    useEffect(() => {
        const controller = new AbortController();

        const getData = async (signal: AbortSignal, projectID: number) => {
            await services.projects.count(signal, projectID);
        };
        const checkProject = (projectID: number): boolean => {
            const local = localStorage.getItem('session');

            if (!local) {
                const createLocal: IClientLocalStorage = {
                    data: { projects: [projectID] },
                    expired: Date.now() + 6 * 60 * 60 * 1000,
                };

                localStorage.setItem('session', JSON.stringify(createLocal));

                return true;
            }

            const storage = JSON.parse(local) as IClientLocalStorage;

            if (storage.expired < Date.now()) {
                localStorage.removeItem('session');

                const createLocal: IClientLocalStorage = {
                    data: { projects: [projectID] },
                    expired: Date.now() + 6 * 60 * 60 * 1000,
                };

                localStorage.setItem('session', JSON.stringify(createLocal));

                return true;
            }

            const { projects } = storage.data;

            if (!projects) {
                const updateStorage: IClientLocalStorage = {
                    ...storage,
                    data: {
                        ...storage.data,
                        projects: [projectID],
                    },
                };

                localStorage.removeItem('session');
                localStorage.setItem('session', JSON.stringify(updateStorage));

                return true;
            }

            if (projects.includes(projectID)) return false;

            const updateStorage: IClientLocalStorage = {
                ...storage,
                data: {
                    ...storage.data,
                    projects: [...projects, projectID],
                },
            };

            localStorage.removeItem('session');
            localStorage.setItem('session', JSON.stringify(updateStorage));

            return true;
        };

        if (props.status === 'success') {
            const isCount = checkProject(props.projectID);

            if (isCount) {
                getData(controller.signal, props.projectID);
            }
        }

        setIsLoaded(true);

        return () => controller.abort();
    }, []);

    // Handles
    const handleOpenModalMap = () => setIsModalMap(true);
    const handleCloseModalMap = () => setIsModalMap(false);

    if (props.status === 'error') return <ErrorComponent statusCode={500} />;

    const { data, posts } = props;

    return (
        <>
            <Head>
                <title>{`Dự án ${decodeURI(data.title)} - BanBds`}</title>
            </Head>
            <main>
                <Container>
                    <Row className='justify-content-evenly'>
                        <Col md={posts ? 8 : 10}>
                            <h1 className={Styles.title}>
                                {decodeURI(data.title)}
                            </h1>
                            <OverlayTrigger
                                placement='top'
                                overlay={<Tooltip>Xem bản đồ</Tooltip>}
                            >
                                <p
                                    className={Styles.address}
                                    style={{ cursor: 'pointer' }}
                                    onClick={handleOpenModalMap}
                                >
                                    {data.address}
                                </p>
                            </OverlayTrigger>
                            <div className={Styles.images}>
                                <Carousel interval={5000}>
                                    {data.images.map((item) => (
                                        <Carousel.Item
                                            className={Styles.images_item}
                                            key={item}
                                        >
                                            <Image
                                                src={`/images/projects/${item}`}
                                                alt={decodeURI(data.title)}
                                                fill
                                            />
                                        </Carousel.Item>
                                    ))}
                                </Carousel>
                                <span className={Styles.status}>
                                    {getName.project.status(data.status)}
                                </span>
                            </div>
                            <div className={Styles.overview}>
                                <h2 className={Styles.title}>Tổng quan</h2>
                                <Row className='flex-wrap my-4'>
                                    <Col lg={6}>
                                        <Row>
                                            <Col xs={6}>
                                                <p
                                                    className={
                                                        Styles.overview_title
                                                    }
                                                >
                                                    Diện tích
                                                </p>
                                            </Col>
                                            <Col xs={6}>
                                                <span
                                                    className={
                                                        Styles.overview_label
                                                    }
                                                >
                                                    {data.acreages}
                                                </span>
                                            </Col>
                                        </Row>
                                    </Col>
                                    {data.prices && (
                                        <>
                                            <div className={Styles.divider} />
                                            <Col lg={6}>
                                                <Row>
                                                    <Col xs={6}>
                                                        <p
                                                            className={
                                                                Styles.overview_title
                                                            }
                                                        >
                                                            Giá
                                                        </p>
                                                    </Col>
                                                    <Col xs={6}>
                                                        <span
                                                            className={
                                                                Styles.overview_label
                                                            }
                                                        >
                                                            {`${
                                                                typeof data.prices ===
                                                                'number'
                                                                    ? data.prices
                                                                    : `${data.prices.min} - ${data.prices.max}`
                                                            } triệu/m²`}
                                                        </span>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </>
                                    )}
                                    {data.investor && (
                                        <>
                                            <div className={Styles.divider} />
                                            <Col lg={6}>
                                                <Row>
                                                    <Col xs={6}>
                                                        <p
                                                            className={
                                                                Styles.overview_title
                                                            }
                                                        >
                                                            Chủ đầu tư
                                                        </p>
                                                    </Col>
                                                    <Col xs={6}>
                                                        <span
                                                            className={
                                                                Styles.overview_label
                                                            }
                                                        >
                                                            {data.investor.name}
                                                        </span>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </>
                                    )}
                                    {data.overview && (
                                        <>
                                            <div className={Styles.divider} />
                                            <Col lg={6}>
                                                <Row>
                                                    <Col xs={6}>
                                                        <p
                                                            className={
                                                                Styles.overview_title
                                                            }
                                                        >
                                                            Số căn hộ
                                                        </p>
                                                    </Col>
                                                    <Col xs={6}>
                                                        <span
                                                            className={
                                                                Styles.overview_label
                                                            }
                                                        >
                                                            {`${data.overview.numberOfApartments} căn`}
                                                        </span>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <div className={Styles.divider} />
                                            <Col lg={6}>
                                                <Row>
                                                    <Col xs={6}>
                                                        <p
                                                            className={
                                                                Styles.overview_title
                                                            }
                                                        >
                                                            Số tòa
                                                        </p>
                                                    </Col>
                                                    <Col xs={6}>
                                                        <span
                                                            className={
                                                                Styles.overview_label
                                                            }
                                                        >
                                                            {`${data.overview.numberOfApartments} tòa`}
                                                        </span>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <div className={Styles.divider} />
                                            <Col lg={6}>
                                                <Row>
                                                    <Col xs={6}>
                                                        <p
                                                            className={
                                                                Styles.overview_title
                                                            }
                                                        >
                                                            Pháp lý
                                                        </p>
                                                    </Col>
                                                    <Col xs={6}>
                                                        <span
                                                            className={
                                                                Styles.overview_label
                                                            }
                                                        >
                                                            {
                                                                data.overview
                                                                    .legal
                                                            }
                                                        </span>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </>
                                    )}
                                </Row>
                            </div>
                            <div
                                className={Styles.content}
                                dangerouslySetInnerHTML={{
                                    __html: decodeURI(data.content),
                                }}
                            />
                        </Col>
                        {posts && (
                            <Col md={3}>
                                <WidgetComponent title='Bất động sản liên quan'>
                                    {posts.map((item) => (
                                        <PostComponent
                                            key={item.id}
                                            mode='vertical'
                                            data={item}
                                        />
                                    ))}
                                </WidgetComponent>
                            </Col>
                        )}
                    </Row>
                </Container>
            </main>
            {isLoaded && (
                <Modal
                    show={isModalMap}
                    onHide={handleCloseModalMap}
                    size='lg'
                    centered
                >
                    <Modal.Header closeButton>Vị trí</Modal.Header>
                    <Modal.Body>
                        <div
                            className='py-3 px-5 flex-wrap'
                            style={{ height: '80vh' }}
                        >
                            <MapComponent
                                lat={data.coordinate.latitude}
                                lng={data.coordinate.longitude}
                            />
                        </div>
                    </Modal.Body>
                </Modal>
            )}
        </>
    );
};

Index.getLayout = (page) => <WebLayout>{page}</WebLayout>;

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    const { title } = ctx.query;

    if (!title || typeof title !== 'string')
        return {
            notFound: true,
        };

    const id = title.split('-').splice(-1, 1)[0];

    if (isNaN(parseInt(id)))
        return {
            notFound: true,
        };

    const projectID = parseInt(id);

    const result = await services.projects.info(projectID);

    if (!result)
        return {
            props: {
                status: 'error',
            },
        };

    if (result === 'NotFound')
        return {
            notFound: true,
        };

    return {
        props: {
            status: 'success',
            projectID,
            ...result,
        },
    };
};

export default Index;
