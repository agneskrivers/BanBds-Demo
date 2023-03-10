import React, {
    FunctionComponent,
    useState,
    useEffect,
    useContext,
} from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import Select, { SingleValue } from 'react-select';
import classNames from 'classnames';

// Styles
import Styles from '../styles/index.module.scss';

// Configs
import {
    SelectCategory,
    SelectFilterPrices,
    SelectFilterAcreages,
    SelectSorts,
} from '@client/configs';

// Context
import { Context } from '@client/context/Web';

// Services
import services from '@client/services';

// Interfaces
import type { ISelect, IPostType } from '@interfaces';

// Props
interface Props {
    type: IPostType;
    projects: ISelect[];
    sort: ISelect;
    category: ISelect | null;
    project: ISelect | null;
    acreages: ISelect | null;
    prices: ISelect | null;
    region: ISelect | null;
    district: ISelect | null;
    search?: string;

    onSearch(value?: string): void;
    onSort(value: SingleValue<ISelect>): void;
    onCategory(value: SingleValue<ISelect>): void;
    onProject(value: SingleValue<ISelect>): void;
    onPrices(value: SingleValue<ISelect>): void;
    onAcreages(value: SingleValue<ISelect>): void;
    onRegion(value: SingleValue<ISelect>): void;
    onDistrict(value: SingleValue<ISelect>): void;
    onType(value: IPostType): void;
}

const Index: FunctionComponent<Props> = (props) => {
    // Props
    const {
        type,
        projects,
        sort,
        category,
        project,
        acreages,
        prices,
        region,
        district,
        search,
        onSearch,
        onSort,
        onCategory,
        onProject,
        onPrices,
        onAcreages,
        onRegion,
        onDistrict,
        onType,
    } = props;

    // States
    const [districts, setDistricts] = useState<ISelect[]>();

    // Effects
    useEffect(() => {
        const controller = new AbortController();

        const getData = async (signal: AbortSignal, id: string) => {
            const result = await services.common.address.districts(signal, id);

            if (!result) throw new Error();

            if (result === 'BadRequest') {
                onRegion(null);

                onNotification(
                    'L???y danh s??ch Qu???n/Huy???n kh??ng th??nh c??ng. Vui l??ng th??? l???i!',
                    'warning'
                );

                return;
            }

            setDistricts(
                [...result].map((item) => ({
                    label: item.name,
                    value: item.districtID,
                }))
            );
        };

        if (props.region) {
            getData(controller.signal, props.region.value).catch(() => {
                onRegion(null);

                onNotification('M??y ch??? b??? l???i. Vui l??ng th??? l???i', 'danger');
            });
        }

        return () => controller.abort();
    }, [props.region]);
    useEffect(() => {
        console.log(props.type);
    }, [props.type]);

    // Handles
    const handleClickReset = () => {
        onSearch(undefined);
        onSort(null);
        onCategory(null);
        onProject(null);
        onPrices(null);
        onAcreages(null);
        onRegion(null);
        onDistrict(null);
    };

    const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
        onSearch(e.target.value);

    // Hooks
    const { regions, onNotification } = useContext(Context);

    return (
        <div className={Styles.search}>
            <Container className='h-100'>
                <Row className='h-100'>
                    <Col md={2}>
                        <div className={classNames(Styles.search_nav)}>
                            <div
                                className={classNames(Styles.search_nav_item, {
                                    [Styles.search_nav_active]: type === 'sell',
                                })}
                                onClick={() => onType('sell')}
                            >
                                B??n
                            </div>
                            <div
                                className={classNames(Styles.search_nav_item, {
                                    [Styles.search_nav_active]: type === 'rent',
                                })}
                                onClick={() => onType('rent')}
                            >
                                Cho thu??
                            </div>
                        </div>
                    </Col>
                    <Col lg={3}>
                        <div className={Styles.search_input}>
                            <span>
                                <i className='material-icons-outlined'>
                                    search
                                </i>
                            </span>
                            <input
                                placeholder='T??m ki???m'
                                value={search}
                                onChange={handleChangeSearch}
                            />
                        </div>
                    </Col>
                    <Col lg={7}>
                        <Row className={classNames(Styles.search_menu)}>
                            <Col lg={5}>
                                <Select
                                    options={SelectCategory}
                                    placeholder='Lo???i nh?? ?????t'
                                    value={category}
                                    onChange={onCategory}
                                />
                            </Col>
                            <Col xs={5}>
                                <Select
                                    options={projects}
                                    placeholder='D??? ??n'
                                    value={project}
                                    onChange={onProject}
                                />
                            </Col>
                            <Col lg={1} className='d-flex align-items-center'>
                                <button
                                    className={Styles.search_reset}
                                    onClick={handleClickReset}
                                >
                                    <i className='material-icons-outlined'>
                                        sync
                                    </i>
                                </button>
                            </Col>
                        </Row>
                        <Row className={classNames(Styles.search_mobile)}>
                            <Col xs={region ? 12 : 6} className='my-1'>
                                <Select
                                    options={SelectSorts}
                                    value={sort}
                                    onChange={onSort}
                                />
                            </Col>
                            <Col xs={6} className='my-1'>
                                <Select
                                    options={SelectCategory}
                                    placeholder='Lo???i nh?? ?????t'
                                    value={category}
                                    onChange={onCategory}
                                    isClearable
                                />
                            </Col>
                            <Col xs={6} className='my-1'>
                                <Select
                                    options={projects}
                                    placeholder='D??? ??n'
                                    value={project}
                                    onChange={onProject}
                                    isClearable
                                />
                            </Col>
                            <Col xs={6} className='my-1'>
                                <Select
                                    options={SelectFilterAcreages}
                                    placeholder='Di???n t??ch'
                                    value={acreages}
                                    onChange={onAcreages}
                                    isClearable
                                />
                            </Col>
                            <Col xs={6} className='my-1'>
                                <Select
                                    options={SelectFilterPrices}
                                    placeholder='Kho???ng gi??'
                                    value={prices}
                                    onChange={onPrices}
                                    isClearable
                                />
                            </Col>
                            <Col xs={6} className='my-1'>
                                <Select
                                    options={regions}
                                    placeholder='T???nh/Th??nh ph???'
                                    value={region}
                                    onChange={onRegion}
                                    isClearable
                                />
                            </Col>
                            {region && (
                                <Col xs={6} className='my-1'>
                                    <Select
                                        options={districts ? districts : []}
                                        placeholder='Qu???n/Huy???n'
                                        value={district}
                                        onChange={onDistrict}
                                        isDisabled={!districts}
                                        isLoading={region && !districts}
                                        isClearable
                                    />
                                </Col>
                            )}
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Index;
