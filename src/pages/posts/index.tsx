/* eslint-disable indent */
import React, { useEffect, useState, useContext } from 'react';
import { Row, Col, Container, Breadcrumb, Spinner } from 'react-bootstrap';
import classNames from 'classnames';
import Head from 'next/head';
import ErrorComponent from 'next/error';
import Select, { SingleValue } from 'react-select';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';

// Styles
import Styles from '@client/scss/pages/posts/index.module.scss';

// Components
import {
    SearchComponent,
    PostComponent,
    SplashComponent,
} from '@client/components';

// Configs
import {
    SelectSorts,
    SelectFilterPrices,
    SelectFilterAcreages,
    SelectCategory,
    FilterAcreages,
    FilterPrices,
} from '@client/configs';

// Context
import { Context } from '@client/context/Web';

// Helpers
import { getName, getValue, getLink } from '@client/helpers';

// Layouts
import { WebLayout } from '@client/layouts';

// Services
import services from '@client/services';

// Interfaces
import type {
    NextPageWithLayout,
    IPropsSeverSide,
    IApiWebPostShortlist,
    IPostType,
    IPostCategory,
    IApiWebRegion,
    IApiWebDistrict,
    IPostFilterByValue,
    IPostCompactForWeb,
    ISelect,
    IPostSortValue,
    ITotalsByAreas,
} from '@interfaces';

// Interface
interface PropsResult extends IApiWebPostShortlist {
    type: IPostType;
    category?: IPostCategory;
    region?: IApiWebRegion;
    district?: IApiWebDistrict;
    prices?: IPostFilterByValue;
    acreages?: IPostFilterByValue;
    search?: string;
}

// Props
type Props = IPropsSeverSide<PropsResult>;

const Index: NextPageWithLayout<Props> = (props) => {
    // States
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [isLoadMore, setIsLoadMore] = useState<boolean>(false);
    const [isCollapsedAreas, setIsCollapsedAreas] = useState<boolean>(false);
    const [isCollapsedPrices, setIsCollapsedPrices] = useState<boolean>(false);
    const [isCollapsedAcreages, setIsCollapsedAcreages] =
        useState<boolean>(false);

    const [posts, setPosts] = useState<IPostCompactForWeb[] | null>([]);
    const [areas, setAreas] = useState<ITotalsByAreas[] | null>(null);

    const [totals, setTotals] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [pages, setPages] = useState<number>(0);

    const [type, setType] = useState<IPostType>('sell');
    const [search, setSearch] = useState<string>();
    const [searchTemp, setSearchTemp] = useState<string>();
    const [category, setCategory] = useState<ISelect | null>(null);
    const [project, setProject] = useState<ISelect | null>(null);
    const [region, setRegion] = useState<ISelect | null>(null);
    const [district, setDistrict] = useState<ISelect | null>(null);
    const [prices, setPrices] = useState<ISelect | null>(null);
    const [acreages, setAcreages] = useState<ISelect | null>(null);
    const [sort, setSort] = useState<ISelect>(SelectSorts[0]);

    // Hooks
    const router = useRouter();
    const { onNotification } = useContext(Context);

    // Effects
    useEffect(() => {
        if (props.status === 'success') {
            if (props.category) {
                const findCategory = [...SelectCategory].find(
                    (item) => item.value === props.category
                );

                if (findCategory) {
                    setCategory(findCategory);
                }
            }

            if (props.search) {
                setSearch(props.search);
            }

            if (props.region) {
                setRegion({
                    label: props.region.name,
                    value: props.region.regionID,
                });
            }

            if (props.district) {
                setDistrict({
                    label: props.district.name,
                    value: props.district.districtID,
                });
            }

            if (props.prices) {
                const { max, min } = props.prices;

                const findPrices = [...FilterPrices].find(
                    (item) => item.min === min && item.max === max
                );

                if (findPrices) {
                    const findSelect = [...SelectFilterPrices].find(
                        (item) => item.value === findPrices.value
                    );

                    if (findSelect) {
                        setPrices(findSelect);
                    }
                }
            }

            if (props.acreages) {
                const { max, min } = props.acreages;

                const findAcreages = [...FilterAcreages].find(
                    (item) => item.min === min && item.max === max
                );

                if (findAcreages) {
                    const findSelect = [...SelectFilterAcreages].find(
                        (item) => item.value === findAcreages.value
                    );

                    if (findSelect) {
                        setAcreages(findSelect);
                    }
                }
            }

            setType(props.type);
            setPosts(props.posts);
            setPages(props.pages);
            setTotals(props.totals);
            setAreas(props.areas);

            setIsLoaded(true);
        }
    }, []);
    useEffect(() => {
        const controller = new AbortController();

        const getData = async (signal: AbortSignal) => {
            let valueRegion: string | undefined;
            let valueDistrict: string | undefined;
            let valueProject: string | undefined;
            let valueCategory: IPostCategory | undefined;
            let valuePricesMin: number | undefined;
            let valuePricesMax: number | undefined;
            let valueAcreagesMin: number | undefined;
            let valueAcreagesMax: number | undefined;
            let valuePrices: IPostSortValue | undefined;
            let valueAcreages: IPostSortValue | undefined;
            let valueCreatedAt: IPostSortValue | undefined;

            if (region) {
                valueRegion = region.value;
            }

            if (district) {
                valueDistrict = district.value;
            }

            if (project) {
                valueProject = project.value;
            }

            if (category) {
                valueCategory = category.value as IPostCategory;
            }

            if (prices) {
                const findPrice = [...FilterPrices].find(
                    (item) => item.value === prices.value
                );

                if (findPrice) {
                    valuePricesMin = findPrice.min;
                    valuePricesMax = findPrice.max;
                }
            }

            if (acreages) {
                const findAcreage = [...FilterAcreages].find(
                    (item) => item.value === acreages.value
                );

                if (findAcreage) {
                    valueAcreagesMin = findAcreage.min;
                    valueAcreagesMax = findAcreage.max;
                }
            }

            if (sort.value !== 'normally') {
                switch (sort.value) {
                    case 'latest':
                        valueCreatedAt = 'desc';
                        break;
                    case 'oldest':
                        valueCreatedAt = 'asc';
                        break;
                    case 'priceIncrease':
                        valuePrices = 'asc';
                        break;
                    case 'priceDecrease':
                        valuePrices = 'desc';
                        break;
                    case 'acreageIncrease':
                        valueAcreages = 'asc';
                        break;
                    case 'acreageDecrease':
                        valueAcreages = 'desc';
                        break;
                }
            }

            const result = await services.posts.shortlist(
                type,
                1,
                valueRegion,
                valueDistrict,
                valueProject,
                search,
                valueCategory,
                valuePricesMin,
                valuePricesMax,
                valueAcreagesMin,
                valueAcreagesMax,
                valuePrices,
                valueAcreages,
                valueCreatedAt,
                signal
            );

            if (!result) throw new Error();

            if (result === 'BadRequest') {
                onNotification(
                    'Nhận tin không thành công. Vui lòng thử lại!',
                    'warning'
                );

                return;
            }

            setPosts(result.posts);
            setPages(result.pages);
            setPage(1);
            setTotals(result.totals);
            setAreas(result.areas);
        };

        if (props.status === 'success' && isLoaded) {
            getData(controller.signal).catch(() => {
                onNotification('Máy chủ bị lỗi. Vui lòng thử lại!');
            });
        }

        return () => controller.abort();
    }, [
        type,
        search,
        searchTemp,
        category,
        project,
        region,
        district,
        prices,
        acreages,
        sort,
    ]);
    useEffect(() => {
        const id = setTimeout(() => setSearch(searchTemp), 500);

        return () => clearTimeout(id);
    }, [searchTemp]);
    useEffect(() => {
        const controller = new AbortController();

        const getData = async (signal: AbortSignal, type: IPostType) => {
            let valueRegion: string | undefined;
            let valueDistrict: string | undefined;
            let valueProject: string | undefined;
            let valueCategory: IPostCategory | undefined;
            let valuePricesMin: number | undefined;
            let valuePricesMax: number | undefined;
            let valueAcreagesMin: number | undefined;
            let valueAcreagesMax: number | undefined;
            let valuePrices: IPostSortValue | undefined;
            let valueAcreages: IPostSortValue | undefined;
            let valueCreatedAt: IPostSortValue | undefined;

            if (region) {
                valueRegion = region.label;
            }

            if (district) {
                valueDistrict = district.label;
            }

            if (project) {
                valueProject = project.value;
            }

            if (category) {
                valueCategory = category.value as IPostCategory;
            }

            if (prices) {
                const findPrice = [...FilterPrices].find(
                    (item) => item.value === prices.value
                );

                if (findPrice) {
                    valuePricesMin = findPrice.min;
                    valuePricesMax = findPrice.max;
                }
            }

            if (acreages) {
                const findAcreage = [...FilterAcreages].find(
                    (item) => item.value === acreages.value
                );

                if (findAcreage) {
                    valueAcreagesMin = findAcreage.min;
                    valueAcreagesMax = findAcreage.max;
                }
            }

            if (sort.value !== 'normally') {
                switch (sort.value) {
                    case 'latest':
                        valueCreatedAt = 'asc';
                        break;
                    case 'oldest':
                        valueCreatedAt = 'desc';
                        break;
                    case 'priceIncrease':
                        valuePrices = 'asc';
                        break;
                    case 'priceDecrease':
                        valuePrices = 'desc';
                        break;
                    case 'acreageIncrease':
                        valueAcreages = 'asc';
                        break;
                    case 'acreageDecrease':
                        valueAcreages = 'desc';
                        break;
                }
            }

            const result = await services.posts.shortlist(
                type,
                page + 1,
                valueRegion,
                valueDistrict,
                valueProject,
                search,
                valueCategory,
                valuePricesMin,
                valuePricesMax,
                valueAcreagesMin,
                valueAcreagesMax,
                valuePrices,
                valueAcreages,
                valueCreatedAt,
                signal
            );

            if (!result) throw new Error();

            if (result === 'BadRequest') {
                setIsLoadMore(false);

                onNotification(
                    'Nhận tin không thành công. Vui lòng thử lại!',
                    'warning'
                );

                return;
            }

            setIsLoadMore(false);
            setPosts((prePosts) => [
                ...(prePosts ? prePosts : []),
                ...result.posts,
            ]);
        };

        if (props.status === 'success' && isLoadMore && pages > page) {
            getData(controller.signal, props.type)
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
        if (props.status === 'success') {
            let valueCategory: IPostCategory | undefined;
            let valuePrices: IPostFilterByValue | undefined;
            let valueAcreages: IPostFilterByValue | undefined;
            let valueRegion: string | undefined;
            let valueDistrict: string | undefined;

            if (category) {
                valueCategory = category.value as IPostCategory;
            }

            if (prices) {
                const findPrices = [...FilterPrices].find(
                    (item) => item.value === prices.value
                );

                if (findPrices) {
                    valuePrices = { min: findPrices.min, max: findPrices.max };
                }
            }

            if (acreages) {
                const findAcreages = [...FilterAcreages].find(
                    (item) => item.value === acreages.value
                );

                if (findAcreages) {
                    valueAcreages = {
                        min: findAcreages.min,
                        max: findAcreages.max,
                    };
                }
            }

            if (region) {
                valueRegion = region.label;
            }

            if (district) {
                valueDistrict = district.label;
            }

            const link = getLink.posts(
                type,
                valueCategory,
                valueRegion,
                valueDistrict,
                valuePrices,
                valueAcreages,
                search
            );

            router.push(link, undefined, { shallow: true });
        }
    }, [category, prices, acreages, region, district, search, type]);

    // Handles
    const handleLoadMore = () => {
        if (pages > page) return setIsLoadMore(true);
    };

    const handleSelectSort = (value: SingleValue<ISelect>) => {
        if (value) return setSort(value);
    };
    const handleSelectCategory = (value: SingleValue<ISelect>) =>
        setCategory(value);
    const handleSelectProject = (value: SingleValue<ISelect>) =>
        setProject(value);
    const handleSelectRegion = (value: SingleValue<ISelect>) =>
        setRegion(value);
    const handleSelectDistrict = (value: SingleValue<ISelect>) =>
        setDistrict(value);
    const handleSelectPrices = (value: SingleValue<ISelect>) =>
        setPrices(value);
    const handleSelectAcreages = (value: SingleValue<ISelect>) =>
        setAcreages(value);

    const handleChangeSearch = (value?: string) => setSearchTemp(value);

    const handleClickArea = (item: ITotalsByAreas) => {
        let valuePrices: IPostFilterByValue | undefined;
        let valueAcreages: IPostFilterByValue | undefined;

        if (prices) {
            const findPrices = [...FilterPrices].find(
                (item) => item.value === prices.value
            );

            if (findPrices) {
                valuePrices = { min: findPrices.min, max: findPrices.max };
            }
        }

        if (acreages) {
            const findAcreages = [...FilterAcreages].find(
                (item) => item.value === acreages.value
            );

            if (findAcreages) {
                valueAcreages = {
                    min: findAcreages.min,
                    max: findAcreages.max,
                };
            }
        }

        const link = getLink.posts(
            type,
            category ? (category.value as IPostCategory) : undefined,
            region ? region.label : item.name,
            region ? item.name : undefined,
            valuePrices,
            valueAcreages,
            search
        );

        router.push(link, undefined, { shallow: true });

        if (!region) {
            setRegion({ label: item.name, value: item.id });

            return;
        }

        if (!district) {
            setDistrict({ label: item.name, value: item.id });
        }
    };
    const handleClickFilterPrices = (value: ISelect) => {
        let valueAcreages: IPostFilterByValue | undefined;

        if (acreages) {
            const findAcreages = [...FilterAcreages].find(
                (item) => item.value === acreages.value
            );

            if (findAcreages) {
                valueAcreages = {
                    min: findAcreages.min,
                    max: findAcreages.max,
                };
            }
        }

        const findPrices = [...FilterPrices].find(
            (item) => item.value === value.value
        );

        if (findPrices) {
            const { min, max } = findPrices;

            const link = getLink.posts(
                type,
                category ? (category.value as IPostCategory) : undefined,
                region ? region.label : undefined,
                district ? district.label : undefined,
                { min, max },
                valueAcreages,
                search
            );

            setPrices(value);

            router.push(link, undefined, { shallow: true });
        }
    };
    const handleClickFilterAcreages = (value: ISelect) => {
        let valuePrices: IPostFilterByValue | undefined;

        if (prices) {
            const findPrices = [...FilterPrices].find(
                (item) => item.value === prices.value
            );

            if (findPrices) {
                valuePrices = { min: findPrices.min, max: findPrices.max };
            }
        }

        const findAcreages = [...FilterAcreages].find(
            (item) => item.value === value.value
        );

        if (findAcreages) {
            const { min, max } = findAcreages;

            const link = getLink.posts(
                type,
                category ? (category.value as IPostCategory) : undefined,
                region ? region.label : undefined,
                district ? district.label : undefined,
                valuePrices,
                { min, max },
                search
            );

            router.push(link, undefined, { shallow: true });

            setAcreages(value);
        }
    };
    const handleClickToggleAreas = () =>
        setIsCollapsedAreas((preIsCollapsed) => !preIsCollapsed);
    const handleClickToggleAcreages = () =>
        setIsCollapsedAcreages((preIsCollapsed) => !preIsCollapsed);
    const handleClickTogglePrices = () =>
        setIsCollapsedPrices((preIsCollapsed) => !preIsCollapsed);
    const handleClickType = (value: IPostType) => {
        let valuePrices: IPostFilterByValue | undefined;
        let valueAcreages: IPostFilterByValue | undefined;

        if (prices) {
            const findPrices = [...FilterPrices].find(
                (item) => item.value === prices.value
            );

            if (findPrices) {
                valuePrices = { min: findPrices.min, max: findPrices.max };
            }
        }

        if (acreages) {
            const findAcreages = [...FilterAcreages].find(
                (item) => item.value === acreages.value
            );

            if (findAcreages) {
                valueAcreages = {
                    min: findAcreages.min,
                    max: findAcreages.max,
                };
            }
        }

        const link = getLink.posts(
            value,
            category ? (category.value as IPostCategory) : undefined,
            region ? region.label : undefined,
            district ? district.label : undefined,
            valuePrices,
            valueAcreages,
            search
        );

        router.push(link, undefined, { shallow: true });
        setType(value);
    };

    if (props.status === 'error') return <ErrorComponent statusCode={500} />;

    if (!posts) return <SplashComponent />;

    return (
        <>
            <Head>
                <title>{`${type === 'sell' ? 'Mua bán' : 'Cho thuê'} ${
                    category
                        ? getName.post
                              .category(category.value as IPostCategory)
                              .toLowerCase()
                        : 'bất động sản'
                } trên ${
                    !region
                        ? 'toàn quốc'
                        : district
                        ? district.label
                        : region.label
                } - BanBds`}</title>
            </Head>
            <SearchComponent.Post
                type={type}
                projects={props.projects}
                search={search}
                sort={sort}
                category={category}
                project={project}
                prices={prices}
                acreages={acreages}
                region={region}
                district={district}
                onAcreages={handleSelectAcreages}
                onCategory={handleSelectCategory}
                onDistrict={handleSelectDistrict}
                onPrices={handleSelectPrices}
                onProject={handleSelectProject}
                onRegion={handleSelectRegion}
                onSearch={handleChangeSearch}
                onSort={handleSelectSort}
                onType={handleClickType}
            />
            <main className='search'>
                <Container>
                    <Row>
                        <Col md={9}>
                            <Breadcrumb>
                                <Breadcrumb.Item active>
                                    {type === 'sell' ? 'Mua bán' : 'Cho thuê'}
                                </Breadcrumb.Item>
                                {region && (
                                    <Breadcrumb.Item active>
                                        {region.label}
                                    </Breadcrumb.Item>
                                )}
                                {district && (
                                    <Breadcrumb.Item active>
                                        {district.label}
                                    </Breadcrumb.Item>
                                )}
                                <Breadcrumb.Item href='#'>
                                    {`${
                                        category
                                            ? getName.post.category(
                                                  category.value as IPostCategory
                                              )
                                            : 'Bất động sản'
                                    } trên ${
                                        !region
                                            ? 'toàn quốc'
                                            : district
                                            ? district.label
                                            : region.label
                                    }`}
                                </Breadcrumb.Item>
                            </Breadcrumb>
                            <h1 className={Styles.title}>
                                {`${type === 'sell' ? 'Mua bán' : 'Cho thuê'} ${
                                    category
                                        ? getName.post
                                              .category(
                                                  category.value as IPostCategory
                                              )
                                              .toLowerCase()
                                        : 'bất động sản'
                                } trên ${
                                    !region
                                        ? 'toàn quốc'
                                        : district
                                        ? district.label
                                        : region.label
                                }`}
                            </h1>
                            <p className={Styles.total}>
                                {`Hiện có ${totals.toLocaleString(
                                    'en'
                                )} bất động sản.`}
                            </p>
                            <Select
                                options={SelectSorts}
                                className='w-25 d-none d-lg-block'
                                value={sort}
                                onChange={handleSelectSort}
                            />
                            <div className={Styles.content}>
                                <InfiniteScroll
                                    className='overflow-hidden p-2'
                                    dataLength={posts.length}
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
                                    {posts.map((item) => (
                                        <PostComponent
                                            mode='normal'
                                            key={item.id}
                                            data={item}
                                        />
                                    ))}
                                </InfiniteScroll>
                            </div>
                        </Col>
                        <Col md={3} className='d-none d-lg-block'>
                            {areas && (
                                <div
                                    className={classNames(
                                        Styles.box,
                                        Styles.box_gray,
                                        Styles.box_active
                                    )}
                                >
                                    <h2 className={Styles.box_title}>
                                        Nhà đất mua bán
                                    </h2>
                                    <div
                                        className={classNames(
                                            Styles.box_content,
                                            {
                                                [Styles.box_collapsed]:
                                                    isCollapsedAreas,
                                            }
                                        )}
                                    >
                                        {areas.map((item) => (
                                            <button
                                                onClick={() =>
                                                    handleClickArea(item)
                                                }
                                                className={Styles.box_item}
                                                key={item.id}
                                            >
                                                {`${
                                                    item.name
                                                } (${item.totals.toLocaleString(
                                                    'en'
                                                )} tin đăng)`}
                                            </button>
                                        ))}
                                    </div>
                                    {areas.length > 12 && (
                                        <button
                                            className={Styles.box_more}
                                            onClick={handleClickToggleAreas}
                                        >
                                            <p className='m-0'>
                                                {isCollapsedAreas
                                                    ? 'Thu gọn'
                                                    : 'Xem thêm'}
                                            </p>
                                            <i className='material-icons-outlined'>
                                                {isCollapsedAreas
                                                    ? ' expand_less'
                                                    : 'expand_more'}
                                            </i>
                                        </button>
                                    )}
                                </div>
                            )}
                            <div
                                className={classNames(
                                    Styles.box,
                                    Styles.box_filter
                                )}
                            >
                                <h2 className={Styles.box_title}>
                                    Lọc theo khoảng giá
                                </h2>
                                <div
                                    className={classNames(Styles.box_content, {
                                        [Styles.box_collapsed]:
                                            isCollapsedPrices,
                                    })}
                                >
                                    {SelectFilterPrices.map(
                                        ({ label, value }) => (
                                            <h3
                                                className={Styles.box_item}
                                                key={value}
                                                onClick={() =>
                                                    handleClickFilterPrices({
                                                        label,
                                                        value,
                                                    })
                                                }
                                            >
                                                {label}
                                            </h3>
                                        )
                                    )}
                                </div>
                                <button
                                    className={Styles.box_more}
                                    onClick={handleClickTogglePrices}
                                >
                                    <p className='m-0'>
                                        {isCollapsedPrices
                                            ? 'Thu gọn'
                                            : 'Xem thêm'}
                                    </p>
                                    <i className='material-icons-outlined'>
                                        {isCollapsedPrices
                                            ? ' expand_less'
                                            : 'expand_more'}
                                    </i>
                                </button>
                            </div>
                            <div
                                className={classNames(
                                    Styles.box,
                                    Styles.box_filter
                                )}
                            >
                                <h2 className={Styles.box_title}>
                                    Lọc theo diện tích
                                </h2>
                                <div
                                    className={classNames(Styles.box_content, {
                                        [Styles.box_collapsed]:
                                            isCollapsedAcreages,
                                    })}
                                >
                                    {SelectFilterAcreages.map(
                                        ({ value, label }) => (
                                            <h3
                                                className={Styles.box_item}
                                                key={value}
                                                onClick={() =>
                                                    handleClickFilterAcreages({
                                                        value,
                                                        label,
                                                    })
                                                }
                                            >
                                                {label}
                                            </h3>
                                        )
                                    )}
                                </div>
                                <button
                                    className={Styles.box_more}
                                    onClick={handleClickToggleAcreages}
                                >
                                    <p className='m-0'>
                                        {isCollapsedAcreages
                                            ? 'Thu gọn'
                                            : 'Xem thêm'}
                                    </p>
                                    <i className='material-icons-outlined'>
                                        {isCollapsedAcreages
                                            ? ' expand_less'
                                            : 'expand_more'}
                                    </i>
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

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    const {
        type,
        category,
        region,
        district,
        queryType,
        queryValue,
        queryValueType,
        s,
    } = ctx.query;

    if (!type || typeof type !== 'string')
        return {
            notFound: true,
        };

    if (category && typeof category !== 'string')
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

    if (queryType && typeof queryType !== 'string')
        return {
            notFound: true,
        };

    if (queryValue && typeof queryValue !== 'string')
        return {
            notFound: true,
        };

    if (queryValueType && typeof queryValueType !== 'string')
        return {
            notFound: true,
        };

    if (s && typeof s !== 'string')
        return {
            notFound: true,
        };

    const query = await getValue.posts(
        type,
        category,
        region,
        district,
        queryType,
        queryValueType,
        queryValue
    );

    if (!query)
        return {
            notFound: true,
        };

    const result = await services.posts.shortlist(
        query.type,
        1,
        query.region ? query.region.regionID : undefined,
        query.district ? query.district.districtID : undefined,
        undefined,
        s,
        query.category,
        query.prices ? query.prices.min : undefined,
        query.prices ? query.prices.max : undefined,
        query.acreages ? query.acreages.min : undefined,
        query.acreages ? query.acreages.max : undefined
    );

    if (!result)
        return {
            props: {
                status: 'error',
            },
        };

    if (result === 'BadRequest')
        return {
            notFound: true,
        };

    let props: Props = {
        status: 'success',
        ...query,
        ...result,
    };

    if (s) {
        props = { ...props, search: s };
    }

    return {
        props,
    };
};

export default Index;
