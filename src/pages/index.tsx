/* eslint-disable indent */
import React, { useEffect, useState, useContext } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Spinner from 'react-bootstrap/Spinner';
import Select, { SingleValue } from 'react-select';
import Link from 'next/link';
import ErrorComponent from 'next/error';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';

// Styles
import Styles from '@client/scss/pages/home/index.module.scss';

// Components
import { CardComponent } from '@client/components';

// Configs
import {
    SelectCategory,
    SelectFilterPrices,
    SelectFilterTypeProject,
    SelectFilterPricesProject,
    FilterPrices,
    FilterProjects,
} from '@client/configs';

// Context
import { Context } from '@client/context/Web';

// Helpers
import { getLink } from '@client/helpers';

// Layouts
import { WebLayout } from '@client/layouts';

// Services
import services from '@client/services';

// Interfaces
import type {
    NextPageWithLayout,
    IPostType,
    ISelect,
    IPostCategory,
    IPostFilterByValue,
    IProjectType,
    IApiWebDashboard,
    IPostCompactForWebDashboard,
} from '@interfaces';

// Type
type SearchType = IPostType | 'project';

// Interface
interface PropsData extends IApiWebDashboard {
    status: 'success';
}
interface PropsNoData {
    status: 'error';
}

// Props
type Props = PropsData | PropsNoData;

const Index: NextPageWithLayout<Props> = (props) => {
    // States
    const [isLoadMoreSell, setIsLoadMoreSell] = useState<boolean>(false);
    const [isLoadMoreRent, setIsLoadMoreRent] = useState<boolean>(false);

    const [search, setSearch] = useState<string>();
    const [searchType, setSearchType] = useState<SearchType>('sell');
    const [searchCategory, setSearchCategory] = useState<ISelect | null>(null);
    const [searchRegion, setSearchRegion] = useState<ISelect | null>(null);
    const [searchPrices, setSearchPrices] = useState<ISelect | null>(null);

    const [sell, setSell] = useState<IPostCompactForWebDashboard[] | null>(() =>
        props.status === 'success' && props.sell ? props.sell.posts : null
    );
    const [rent, setRent] = useState<IPostCompactForWebDashboard[] | null>(() =>
        props.status === 'success' && props.rent ? props.rent.posts : null
    );

    const [pageSell, setPageSell] = useState<number>(1);
    const [pageRent, setPageRent] = useState<number>(1);

    // Hooks
    const router = useRouter();
    const { onNotification, regions } = useContext(Context);

    // Effects
    useEffect(() => {
        const controller = new AbortController();

        const getData = async (signal: AbortSignal) => {
            const data = await services.posts.dashboard(
                signal,
                'sell',
                pageSell + 1
            );

            if (!data) throw new Error();

            if (data === 'BadRequest') {
                setIsLoadMoreSell(false);

                onNotification(
                    'Lấy danh sách bất động sản bị lỗi. Vui lòng thử lại sau!',
                    'warning'
                );

                return;
            }

            setIsLoadMoreSell(false);

            setSell((preSell) => [...(preSell ? preSell : []), ...data.posts]);
        };

        if (
            isLoadMoreSell &&
            props.status === 'success' &&
            props.sell &&
            props.sell.pages > pageSell
        ) {
            getData(controller.signal)
                .then(() => setPageSell((prePage) => prePage + 1))
                .catch(() => {
                    setIsLoadMoreSell(false);

                    onNotification('Máy chủ bị lỗi!', 'danger');
                });
        } else {
            setIsLoadMoreSell(false);
        }

        return () => controller.abort();
    }, [isLoadMoreSell]);
    useEffect(() => {
        const controller = new AbortController();

        const getData = async (signal: AbortSignal) => {
            const data = await services.posts.dashboard(
                signal,
                'rent',
                pageSell + 1
            );

            if (!data) throw new Error();

            if (data === 'BadRequest') {
                setIsLoadMoreSell(false);

                onNotification(
                    'Lấy danh sách bất động sản bị lỗi. Vui lòng thử lại sau!',
                    'warning'
                );

                return;
            }

            setIsLoadMoreRent(false);

            setRent((preRent) => [...(preRent ? preRent : []), ...data.posts]);
        };

        if (
            isLoadMoreRent &&
            props.status === 'success' &&
            props.rent &&
            props.rent.pages > pageSell
        ) {
            getData(controller.signal)
                .then(() => setPageRent((prePage) => prePage + 1))
                .catch(() => {
                    setIsLoadMoreRent(false);

                    onNotification('Máy chủ bị lỗi!', 'danger');
                });
        } else {
            setIsLoadMoreRent(false);
        }

        return () => controller.abort();
    }, [isLoadMoreRent]);

    // Handles
    const handleClickSearchType = (type: SearchType) => setSearchType(type);
    const handleClickSearch = () => {
        if (searchType !== 'project') {
            let category: IPostCategory | undefined;
            let prices: IPostFilterByValue | undefined;
            let region: string | undefined;

            if (searchCategory) {
                category = searchCategory.value as IPostCategory;
            }

            if (searchPrices) {
                const findFilterPrices = [...FilterPrices].find(
                    (item) => item.value === searchPrices.value
                );

                if (findFilterPrices) {
                    prices = {
                        max: findFilterPrices.max,
                        min: findFilterPrices.min,
                    };
                }
            }

            if (searchRegion) {
                region = searchRegion.label;
            }

            const link = getLink.posts(
                searchType,
                category,
                region,
                undefined,
                prices,
                undefined,
                search
            );

            window.location.href = link;

            return;
        }

        let type: IProjectType | undefined;
        let region: string | undefined;
        let prices: IPostFilterByValue | undefined;

        if (searchCategory) {
            type = searchCategory.value as IProjectType;
        }

        if (searchRegion) {
            region = searchRegion.label;
        }

        if (searchPrices) {
            const findPrice = [...FilterProjects].find(
                (item) => item.value === searchPrices.value
            );

            if (findPrice) {
                prices = {
                    min: findPrice.min,
                    max: findPrice.max,
                };
            }
        }

        const link = getLink.project(type, region, undefined, prices, search);

        router.push(link);
    };
    const handleClickLoadMoreSell = () => setIsLoadMoreSell(true);
    const handleClickLoadMoreRent = () => setIsLoadMoreRent(true);

    const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
        setSearch(e.target.value);

    const handleSelectSearchCategory = (value: SingleValue<ISelect>) =>
        setSearchCategory(value);
    const handleSelectSearchRegion = (value: SingleValue<ISelect>) =>
        setSearchRegion(value);
    const handleSelectSearchPrices = (value: SingleValue<ISelect>) =>
        setSearchPrices(value);

    if (props.status === 'error') return <ErrorComponent statusCode={500} />;

    return (
        <>
            <Head>
                <title>
                    Công nghệ bán Bất Động Sản nhanh nhất Việt Nam - BanBds
                </title>
            </Head>
            <main style={{ paddingTop: 0 }}>
                <section className={Styles.banner}>
                    <Image
                        src='/images/common/background.jpg'
                        fill
                        alt='Banner BanBds'
                    />
                    <div className={Styles.banner_content}>
                        <Nav
                            variant='tabs'
                            className={Styles.search}
                            activeKey={searchType}
                        >
                            <Nav.Item>
                                <Nav.Link
                                    className={classNames(Styles.search_btn, {
                                        [Styles.search_btn_active]:
                                            searchType === 'sell',
                                    })}
                                    eventKey='sell'
                                    onClick={() =>
                                        handleClickSearchType('sell')
                                    }
                                >
                                    Mua bán
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link
                                    className={classNames(Styles.search_btn, {
                                        [Styles.search_btn_active]:
                                            searchType === 'rent',
                                    })}
                                    eventKey='rent'
                                    onClick={() =>
                                        handleClickSearchType('rent')
                                    }
                                >
                                    Cho thuê
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link
                                    className={classNames(Styles.search_btn, {
                                        [Styles.search_btn_active]:
                                            searchType === 'project',
                                    })}
                                    eventKey='project'
                                    onClick={() =>
                                        handleClickSearchType('project')
                                    }
                                >
                                    Dự án
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <div
                            className={classNames(Styles.search_content, {
                                [Styles.search_content_border]:
                                    searchType !== 'sell',
                            })}
                        >
                            <div className={Styles.search_content_input}>
                                <input
                                    placeholder='Tìm nhanh'
                                    onChange={handleChangeSearch}
                                />
                                <Button
                                    variant='danger'
                                    onClick={handleClickSearch}
                                    disabled={
                                        !search &&
                                        !searchCategory &&
                                        !searchPrices &&
                                        !searchRegion
                                    }
                                >
                                    Tìm kiếm
                                </Button>
                            </div>
                            <Row>
                                <Col md={4} className='mb-2 mb-md-0'>
                                    <Select
                                        options={
                                            searchType === 'project'
                                                ? SelectFilterTypeProject
                                                : SelectCategory
                                        }
                                        placeholder='Loại nhà đất'
                                        isClearable
                                        onChange={handleSelectSearchCategory}
                                    />
                                </Col>
                                <Col md={4} className='mb-2 mb-md-0'>
                                    <Select
                                        options={regions}
                                        placeholder='Tỉnh thành'
                                        isClearable
                                        onChange={handleSelectSearchRegion}
                                    />
                                </Col>
                                <Col md={4}>
                                    <Select
                                        options={
                                            searchType === 'project'
                                                ? SelectFilterPricesProject
                                                : SelectFilterPrices
                                        }
                                        placeholder='Khoảng giá'
                                        isClearable
                                        onChange={handleSelectSearchPrices}
                                    />
                                </Col>
                            </Row>
                        </div>
                    </div>
                </section>
                <Container>
                    {/* News */}
                    {props.news && (
                        <section>
                            <Row className='justify-content-center'>
                                <Col lg={9} xs={12}>
                                    <Row>
                                        <Col md={8}>
                                            <Link
                                                href={props.news.hot.link}
                                                className={Styles.news_hot}
                                            >
                                                <div
                                                    className={
                                                        Styles.news_hot_img
                                                    }
                                                >
                                                    <Image
                                                        src={`/images/news/${props.news.hot.thumbnail}`}
                                                        fill
                                                        alt={decodeURI(
                                                            props.news.hot.title
                                                        )}
                                                    />
                                                </div>
                                                <div
                                                    className={
                                                        Styles.news_hot_content
                                                    }
                                                >
                                                    <h3
                                                        className={
                                                            Styles.news_hot_title
                                                        }
                                                    >
                                                        {decodeURI(
                                                            props.news.hot.title
                                                        )}
                                                    </h3>
                                                    <p
                                                        className={
                                                            Styles.news_hot_description
                                                        }
                                                    >
                                                        {decodeURI(
                                                            props.news.hot
                                                                .content
                                                        )}
                                                    </p>
                                                </div>
                                            </Link>
                                        </Col>
                                        <Col md={4}>
                                            <ul className={Styles.news_compact}>
                                                {[...props.news.latests].map(
                                                    (item) => (
                                                        <li key={item.id}>
                                                            <Link
                                                                href={item.link}
                                                                className='news_compact_item'
                                                            >
                                                                {decodeURI(
                                                                    item.title
                                                                )}
                                                            </Link>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg={3} xs={0}>
                                    <div className={Styles.news_banner}>
                                        <Image
                                            src='/images/common/banner.jpeg'
                                            fill
                                            alt='News Banner'
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </section>
                    )}
                    {/* Projects */}
                    {props.projects && (
                        <section className='d-block'>
                            <div className={Styles.heading}>
                                <div className={Styles.heading_left}>
                                    <h2>Dự án</h2>
                                    <span className={Styles.heading_divider} />
                                </div>
                                <Link
                                    href='/du-an-bat-dong-san'
                                    className={Styles.heading_btn}
                                >
                                    <span>Xem thêm</span>
                                    <i className='material-icons'>east</i>
                                </Link>
                            </div>
                            <Row>
                                {props.projects.map((item) => (
                                    <Col lg={4} key={item.id}>
                                        <CardComponent.Project {...item} />
                                    </Col>
                                ))}
                            </Row>
                        </section>
                    )}
                    {/* Posts Sell */}
                    {props.sell && sell && (
                        <section className='d-block'>
                            <div className={Styles.heading}>
                                <div className={Styles.heading_left}>
                                    <h2>Bất động sản cần bán</h2>
                                    <span className={Styles.heading_divider} />
                                </div>
                                <Link
                                    href='/ban-bat-dong-san'
                                    className={Styles.heading_btn}
                                >
                                    <span>Xem thêm</span>
                                    <i className='material-icons'>east</i>
                                </Link>
                            </div>
                            <Row>
                                {sell.map((item) => (
                                    <Col lg={4} key={item.id}>
                                        <CardComponent.Post {...item} />
                                    </Col>
                                ))}
                            </Row>
                            {props.sell.pages > 0 &&
                                props.sell.pages > pageSell && (
                                    <div className={Styles.more}>
                                        <button
                                            onClick={handleClickLoadMoreSell}
                                        >
                                            {isLoadMoreSell ? (
                                                <Spinner variant='light' />
                                            ) : (
                                                <>
                                                    <span>Xem nhiều hơn</span>
                                                    <i className='material-icons'>
                                                        keyboard_arrow_down
                                                    </i>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                        </section>
                    )}
                    {/* Posts Rent */}
                    {props.rent && rent && (
                        <section className='d-block'>
                            <div className={Styles.heading}>
                                <div className={Styles.heading_left}>
                                    <h2>Bất động sản cho thuê</h2>
                                    <span className={Styles.heading_divider} />
                                </div>
                                <Link
                                    href='/cho-thue-bat-dong-san'
                                    className={Styles.heading_btn}
                                >
                                    <span>Xem thêm</span>
                                    <i className='material-icons'>east</i>
                                </Link>
                            </div>
                            <Row>
                                {rent.map((item) => (
                                    <Col lg={4} key={item.id}>
                                        <CardComponent.Post {...item} />
                                    </Col>
                                ))}
                            </Row>
                            {props.rent.pages > 0 &&
                                props.rent.pages > pageRent && (
                                    <div className={Styles.more}>
                                        <button
                                            onClick={handleClickLoadMoreRent}
                                        >
                                            {isLoadMoreRent ? (
                                                <Spinner variant='light' />
                                            ) : (
                                                <>
                                                    <span>Xem nhiều hơn</span>
                                                    <i className='material-icons'>
                                                        keyboard_arrow_down
                                                    </i>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                        </section>
                    )}
                    {/* Posts By Area */}
                    {props.areas && (
                        <section className='d-block'>
                            <div className={Styles.heading}>
                                <div className={Styles.heading_left}>
                                    <h2>Bất động sản theo địa điểm</h2>
                                    <span className={Styles.heading_divider} />
                                </div>
                            </div>
                            <Row>
                                <Col lg={6}>
                                    <Link href='/ban-bat-dong-san/ha-noi'>
                                        <div className={Styles.location}>
                                            <Image
                                                src='/images/common/area-1.webp'
                                                alt='Mua Ban Nha Dat Ha Noi'
                                                fill
                                            />
                                            <div
                                                className={
                                                    Styles.location_content
                                                }
                                            >
                                                <h3
                                                    className={
                                                        Styles.location_name
                                                    }
                                                >
                                                    Hà Nội
                                                </h3>
                                                <p
                                                    className={
                                                        Styles.location_totals
                                                    }
                                                >
                                                    {`${props.areas['hn']} tin đăng`}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </Col>
                                <Col lg={6}>
                                    <Row className='flex_wrap'>
                                        <Col xs={6} className='mb-4'>
                                            <Link href='/ban-bat-dong-san/ho-chi-minh'>
                                                <div
                                                    className={classNames(
                                                        Styles.location,
                                                        Styles.location_item
                                                    )}
                                                >
                                                    <Image
                                                        src='/images/common/area-2.webp'
                                                        alt='Mua Ban Nha Dat Ho Chi Minh'
                                                        fill
                                                    />
                                                    <div
                                                        className={
                                                            Styles.location_content
                                                        }
                                                    >
                                                        <h3
                                                            className={
                                                                Styles.location_name
                                                            }
                                                        >
                                                            Hồ Chí Minh
                                                        </h3>
                                                        <p
                                                            className={
                                                                Styles.location_totals
                                                            }
                                                        >
                                                            {`${props.areas['hcm']} tin đăng`}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </Col>
                                        <Col xs={6} className='mb-4'>
                                            <Link href='/ban-bat-dong-san/bac-ninh'>
                                                <div
                                                    className={classNames(
                                                        Styles.location,
                                                        Styles.location_item
                                                    )}
                                                >
                                                    <Image
                                                        src='/images/common/area-3.webp'
                                                        alt='Mua Ban Nha Dat Bac Ninh'
                                                        fill
                                                    />
                                                    <div
                                                        className={
                                                            Styles.location_content
                                                        }
                                                    >
                                                        <h3
                                                            className={
                                                                Styles.location_name
                                                            }
                                                        >
                                                            Bắc Ninh
                                                        </h3>
                                                        <p
                                                            className={
                                                                Styles.location_totals
                                                            }
                                                        >
                                                            {`${props.areas['bn']} tin đăng`}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </Col>
                                        <Col xs={6}>
                                            <Link href='/ban-bat-dong-san/bac-giang'>
                                                <div
                                                    className={classNames(
                                                        Styles.location,
                                                        Styles.location_item
                                                    )}
                                                >
                                                    <Image
                                                        src='/images/common/area-4.webp'
                                                        alt='Mua Ban Nha Dat Bac Giang'
                                                        fill
                                                    />
                                                    <div
                                                        className={
                                                            Styles.location_content
                                                        }
                                                    >
                                                        <h3
                                                            className={
                                                                Styles.location_name
                                                            }
                                                        >
                                                            Bắc Giang
                                                        </h3>
                                                        <p
                                                            className={
                                                                Styles.location_totals
                                                            }
                                                        >
                                                            {`${props.areas['bg']} tin đăng`}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </Col>
                                        <Col xs={6}>
                                            <Link href='/ban-bat-dong-san/hai-duong'>
                                                <div
                                                    className={classNames(
                                                        Styles.location,
                                                        Styles.location_item
                                                    )}
                                                >
                                                    <Image
                                                        src='/images/common/area-5.webp'
                                                        alt='Mua Ban Nha Dat Hai Duong'
                                                        fill
                                                    />
                                                    <div
                                                        className={
                                                            Styles.location_content
                                                        }
                                                    >
                                                        <h3
                                                            className={
                                                                Styles.location_name
                                                            }
                                                        >
                                                            Hải Dương
                                                        </h3>
                                                        <p
                                                            className={
                                                                Styles.location_totals
                                                            }
                                                        >
                                                            {`${props.areas['hd']} tin đăng`}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </section>
                    )}
                </Container>
            </main>
        </>
    );
};

Index.getLayout = (page) => <WebLayout>{page}</WebLayout>;

export const getServerSideProps: GetServerSideProps<Props> = async () => {
    const data = await services.dashboard();

    if (!data)
        return {
            props: {
                status: 'error',
            },
        };

    return {
        props: {
            ...data,
            status: 'success',
        },
    };
};

export default Index;
