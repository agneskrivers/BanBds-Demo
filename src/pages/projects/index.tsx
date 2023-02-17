/* eslint-disable indent */
import React, { useState, useEffect, useContext } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Head from 'next/head';
import ErrorComponent from 'next/error';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { Container, Row, Col, Breadcrumb, Spinner } from 'react-bootstrap';
import { SingleValue } from 'react-select';

// Styles
import Styles from '@client/scss/pages/projects/index.module.scss';

// Components
import {
    SearchComponent,
    ProjectComponent,
    SplashComponent,
} from '@client/components';

// Configs
import {
    SelectFilterPricesProject,
    FilterProjects,
    SelectFilterTypeProject,
} from '@client/configs';

// Context
import { Context } from '@client/context/Web';

// Helpers
import { getValue, getName, getLink } from '@client/helpers';

// Layouts
import { WebLayout } from '@client/layouts';

// Services
import services from '@client/services';

// Interfaces
import type {
    NextPageWithLayout,
    IProjectType,
    IPostFilterByValue,
    IApiWebRegion,
    IApiWebDistrict,
    IApiWebProjectShortlist,
    IPropsSeverSide,
    IProjectCompactForWeb,
    ISelect,
    IProjectStatus,
    ITotalsByAreas,
} from '@interfaces';

// Interfaces
interface ResultProps extends IApiWebProjectShortlist {
    type?: IProjectType;
    region?: IApiWebRegion;
    district?: IApiWebDistrict;
    prices?: IPostFilterByValue;
    search?: string;
}

// Props
type Props = IPropsSeverSide<ResultProps>;

const Index: NextPageWithLayout<Props> = (props) => {
    // States
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [isLoadMore, setIsLoadMore] = useState<boolean>(false);

    const [page, setPage] = useState<number>(1);
    const [pages, setPages] = useState<number>(0);
    const [totals, setTotals] = useState<number>(0);

    const [data, setData] = useState<IProjectCompactForWeb[]>([]);
    const [areas, setAreas] = useState<ITotalsByAreas[] | null>(null);

    const [search, setSearch] = useState<string>();
    const [searchType, setSearchType] = useState<ISelect>();
    const [searchStatus, setSearchStatus] = useState<ISelect>();
    const [searchPrices, setSearchPrices] = useState<ISelect>();
    const [searchRegion, setSearchRegion] = useState<ISelect>();
    const [searchDistrict, setSearchDistrict] = useState<ISelect>();

    // Hooks
    const router = useRouter();
    const { onNotification } = useContext(Context);

    // Effects
    useEffect(() => {
        if (props.status === 'success' && !isLoaded) {
            const { s } = router.query;

            if (s && typeof s === 'string') {
                setSearch(s);
            }

            if (props.type) {
                const findType = [...SelectFilterTypeProject].find(
                    (item) => item.value === props.type
                );

                if (findType) {
                    setSearchType(findType);
                }
            }

            if (props.prices) {
                const { min, max } = props.prices;

                const findFilterPrices = [...FilterProjects].find(
                    (item) => item.min === min && item.max === max
                );

                if (findFilterPrices) {
                    const filterSelect = [...SelectFilterPricesProject].find(
                        (item) => item.value === findFilterPrices.value
                    );

                    if (filterSelect) {
                        setSearchPrices(filterSelect);
                    }
                }
            }

            if (props.region) {
                setSearchRegion({
                    label: props.region.name,
                    value: props.region.regionID,
                });
            }

            if (props.district) {
                setSearchDistrict({
                    label: props.district.name,
                    value: props.district.districtID,
                });
            }

            if (props.search) {
                setSearch(props.search);
            }

            setData(props.projects);
            setPages(props.pages);
            setTotals(props.totals);
            setAreas(props.areas);

            setIsLoaded(true);
        }
    }, []);
    useEffect(() => {
        let type: IProjectType | undefined;
        let prices: IPostFilterByValue | undefined;
        let region: string | undefined;
        let district: string | undefined;

        if (searchType) {
            type = searchType.value as IProjectType;
        }

        if (searchPrices) {
            const findPrices = [...FilterProjects].find(
                (item) => item.value === searchPrices.value
            );

            if (findPrices) {
                prices = { min: findPrices.min, max: findPrices.max };
            }
        }

        if (searchRegion) {
            region = searchRegion.label;
        }

        if (searchDistrict) {
            district = searchDistrict.label;
        }

        const link = getLink.project(type, region, district, prices, search);

        router.push(link, undefined, { shallow: true });
    }, [search, searchType, searchPrices, searchRegion, searchDistrict]);
    useEffect(() => {
        const controller = new AbortController();

        const getData = async (signal: AbortSignal) => {
            let type: IProjectType | undefined;
            let prices: IPostFilterByValue | undefined;
            let region: string | undefined;
            let district: string | undefined;
            let status: IProjectStatus | undefined;

            if (searchType) {
                type = searchType.value as IProjectType;
            }

            if (searchPrices) {
                const findPrices = [...FilterProjects].find(
                    (item) => item.value === searchPrices.value
                );

                if (findPrices) {
                    prices = { min: findPrices.min, max: findPrices.max };
                }
            }

            if (searchRegion) {
                region = searchRegion.value;
            }

            if (searchDistrict) {
                district = searchDistrict.value;
            }

            if (searchStatus) {
                status = searchStatus.value as IProjectStatus;
            }

            console.log(region);

            const result = await services.projects.shortlist(
                1,
                region,
                district,
                search,
                type,
                status,
                prices ? prices.min : undefined,
                prices ? prices.max : undefined,
                signal
            );

            if (!result) throw new Error();

            if (result === 'BadRequest') {
                setSearchStatus(undefined);

                onNotification(
                    'Lấy danh sách dự án không thành công. Vui lòng thử lại!',
                    'warning'
                );

                return;
            }

            setPages(result.pages);
            setData(result.projects);
            setTotals(result.totals);
            setAreas(result.areas);
            setPage(1);
        };

        if (props.status === 'success') {
            getData(controller.signal).catch(() => {
                onNotification(
                    'Máy chủ bị lỗi. Vui lòng thử lại sau!',
                    'danger'
                );
            });
        }

        return () => controller.abort();
    }, [
        search,
        searchType,
        searchStatus,
        searchPrices,
        searchRegion,
        searchDistrict,
    ]);
    useEffect(() => {
        const controller = new AbortController();

        const getData = async (signal: AbortSignal) => {
            let type: IProjectType | undefined;
            let prices: IPostFilterByValue | undefined;
            let region: string | undefined;
            let district: string | undefined;
            let status: IProjectStatus | undefined;

            if (searchType) {
                type = searchType.value as IProjectType;
            }

            if (searchPrices) {
                const findPrices = [...FilterProjects].find(
                    (item) => item.value === searchPrices.value
                );

                if (findPrices) {
                    prices = { min: findPrices.min, max: findPrices.max };
                }
            }

            if (searchRegion) {
                region = searchRegion.label;
            }

            if (searchDistrict) {
                district = searchDistrict.label;
            }

            if (searchStatus) {
                status = searchStatus.value as IProjectStatus;
            }

            const result = await services.projects.shortlist(
                page + 1,
                region,
                district,
                search,
                type,
                status,
                prices ? prices.min : undefined,
                prices ? prices.max : undefined,
                signal
            );

            if (!result) throw new Error();

            if (result === 'BadRequest') {
                setIsLoadMore(false);

                onNotification(
                    'Lấy danh sách dự án không thành công. Vui lòng thử lại!',
                    'warning'
                );

                return;
            }

            setIsLoadMore(false);
            setData((preData) => [...preData, ...result.projects]);
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
        }

        return () => controller.abort();
    }, [isLoadMore]);

    // Handles
    const handleLoadMore = () => setIsLoadMore(true);

    const handleSelectType = (value: SingleValue<ISelect>) => {
        if (!value) return setSearchType(undefined);

        setSearchType(value);
    };
    const handleSelectStatus = (value: SingleValue<ISelect>) => {
        if (!value) return setSearchStatus(undefined);

        setSearchStatus(value);
    };
    const handleSelectPrices = (value: SingleValue<ISelect>) => {
        if (!value) return setSearchPrices(undefined);

        setSearchPrices(value);
    };
    const handleSelectRegion = (value: SingleValue<ISelect>) => {
        if (!value) return setSearchRegion(undefined);

        setSearchRegion(value);
    };
    const handleSelectDistrict = (value: SingleValue<ISelect>) => {
        if (!value) return setSearchDistrict(undefined);

        setSearchDistrict(value);
    };

    const handleClickArea = async (item: ITotalsByAreas) => {
        let prices: IPostFilterByValue | undefined;

        if (searchPrices) {
            const findPrices = [...FilterProjects].find(
                (item) => item.value === searchPrices.value
            );

            if (findPrices) {
                prices = { min: findPrices.min, max: findPrices.max };
            }
        }

        const link = getLink.project(
            searchType ? (searchType.value as IProjectType) : undefined,
            searchRegion ? searchRegion.label : item.name,
            searchRegion ? item.name : undefined,
            prices,
            search
        );

        router.push(link, undefined, { shallow: true });

        if (!searchRegion) {
            setSearchRegion({ label: item.name, value: item.id });

            return;
        }

        if (!searchDistrict) {
            setSearchDistrict({ label: item.name, value: item.id });
        }
    };

    if (props.status === 'error') return <ErrorComponent statusCode={500} />;

    if (!isLoaded) return <SplashComponent />;

    return (
        <>
            <Head>
                <title>{`Thông tin dự án bất động sản mới nhất năm ${new Date().getFullYear()} - BanBds`}</title>
            </Head>
            <SearchComponent.Project
                type={searchType}
                status={searchStatus}
                region={searchRegion}
                district={searchDistrict}
                prices={searchPrices}
                onType={handleSelectType}
                onStatus={handleSelectStatus}
                onPrices={handleSelectPrices}
                onDistrict={handleSelectDistrict}
                onRegion={handleSelectRegion}
            />
            <main className='search'>
                <Container>
                    <Row className='justify-content-evenly'>
                        <Col md={8}>
                            <Breadcrumb>
                                <Breadcrumb.Item href='#' active>
                                    Dự án
                                </Breadcrumb.Item>
                                {!searchRegion && !searchDistrict && (
                                    <Breadcrumb.Item>Toàn Quốc</Breadcrumb.Item>
                                )}
                                {searchRegion && (
                                    <Breadcrumb.Item
                                        active={searchDistrict !== undefined}
                                    >
                                        {searchRegion.label}
                                    </Breadcrumb.Item>
                                )}
                                {searchRegion && searchDistrict && (
                                    <Breadcrumb.Item>
                                        {searchDistrict.label}
                                    </Breadcrumb.Item>
                                )}
                            </Breadcrumb>
                            <h1 className={Styles.title}>
                                {`Dự án ${
                                    searchType
                                        ? getName.project
                                              .t(
                                                  searchType.value as IProjectType
                                              )
                                              .toLowerCase()
                                        : 'bất động sản'
                                } ${
                                    !searchRegion
                                        ? 'toàn quốc'
                                        : searchDistrict
                                        ? searchDistrict.label
                                        : searchRegion.label
                                }`}
                            </h1>
                            <p className={Styles.total}>
                                {`Hiện đang có ${totals.toLocaleString(
                                    'en'
                                )} dự án`}
                            </p>
                            <InfiniteScroll
                                dataLength={data.length}
                                hasMore={pages > page}
                                loader={
                                    <div className='d-flex justify-content-center align-items-center pt-4 pb-4'>
                                        <Spinner
                                            animation='border'
                                            variant='primary'
                                        />
                                    </div>
                                }
                                next={handleLoadMore}
                                className='overflow-hidden p-2'
                            >
                                {data.map((item) => (
                                    <ProjectComponent key={item.id} {...item} />
                                ))}
                            </InfiniteScroll>
                        </Col>
                        {areas && (
                            <Col md={3} className='d-none d-lg-block'>
                                <div className={Styles.box}>
                                    <h2 className={Styles.box_title}>
                                        {`Khu vực ${
                                            searchRegion
                                                ? searchRegion.label
                                                : 'toàn quốc'
                                        }`}
                                    </h2>
                                    <div className={Styles.box_content}>
                                        {areas.map((item, index) => (
                                            <button
                                                onClick={() =>
                                                    handleClickArea(item)
                                                }
                                                className={Styles.box_item}
                                                key={index}
                                            >
                                                {`${
                                                    item.name
                                                } (${item.totals.toLocaleString(
                                                    'en'
                                                )} dự án)`}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </Col>
                        )}
                    </Row>
                </Container>
            </main>
        </>
    );
};

Index.getLayout = (page) => <WebLayout>{page}</WebLayout>;

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    const { type, region, district, pricesQuery, prices, s } = ctx.query;

    if (!type || typeof type !== 'string')
        return {
            notFound: true,
        };

    if (region && typeof region !== 'string')
        return {
            notFound: true,
        };

    if (district && typeof district !== 'string')
        return {
            notFound: true,
        };

    if (pricesQuery && typeof pricesQuery !== 'string')
        return {
            notFound: true,
        };

    if (prices && typeof prices !== 'string')
        return {
            notFound: true,
        };

    if (s && typeof s !== 'string')
        return {
            notFound: true,
        };

    const query = await getValue.projects(
        type,
        region,
        district,
        pricesQuery,
        prices
    );

    if (!query)
        return {
            notFound: true,
        };

    const regionID = query.region ? query.region.regionID : undefined;
    const districtID = query.district ? query.district.districtID : undefined;

    const data = await services.projects.shortlist(
        1,
        regionID,
        districtID,
        s,
        query.type,
        undefined,
        query.prices ? query.prices.min : undefined,
        query.prices ? query.prices.max : undefined
    );

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

    let props: Props = {
        status: 'success',
        ...data,
        ...query,
    };

    if (s) {
        props = { ...props, search: s };
    }

    return {
        props,
    };
};

export default Index;
