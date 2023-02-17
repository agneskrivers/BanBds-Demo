import React, {
    FunctionComponent,
    useState,
    useEffect,
    useContext,
} from 'react';
import classNames from 'classnames';
import Select, { SingleValue } from 'react-select';
import { Container, Row, Col } from 'react-bootstrap';

// Styles
import Styles from '../styles/index.module.scss';

// Configs
import {
    SelectFilterPricesProject,
    SelectFilterStatusProject,
    SelectFilterTypeProject,
} from '@client/configs';

// Context
import { Context } from '@client/context/Web';

// Services
import services from '@client/services';

// Interfaces
import { ISelect } from '@interfaces';

// Props
interface Props {
    type?: ISelect;
    status?: ISelect;
    prices?: ISelect;
    region?: ISelect;
    district?: ISelect;

    onType(value: SingleValue<ISelect>): void;
    onStatus(value: SingleValue<ISelect>): void;
    onPrices(value: SingleValue<ISelect>): void;
    onRegion(value: SingleValue<ISelect>): void;
    onDistrict(value: SingleValue<ISelect>): void;
}

const Index: FunctionComponent<Props> = (props) => {
    // Props
    const {
        district,
        prices,
        region,
        status,
        type,
        onDistrict,
        onPrices,
        onRegion,
        onStatus,
        onType,
    } = props;

    // States
    const [districts, setDistricts] = useState<ISelect[]>();

    // Effects
    useEffect(() => {
        const controller = new AbortController();

        const getData = async (signal: AbortSignal, id: string) => {
            const result = await services.common.address.districts(signal, id);

            if (!result || result === 'BadRequest') return;

            setDistricts(
                [...result].map((item) => ({
                    label: item.name,
                    value: item.districtID,
                }))
            );
        };

        if (region) {
            getData(controller.signal, region.value);
        }

        return () => controller.abort();
    }, []);

    // Handles
    const handleClickReset = () => {
        onDistrict(null);
        onPrices(null);
        onRegion(null);
        onStatus(null);
        onType(null);
    };

    // Hooks
    const { regions } = useContext(Context);

    return (
        <div className={Styles.search}>
            <Container>
                <Row>
                    <Col lg={3}>
                        <div className={Styles.search_input}>
                            <span>
                                <i className='material-icons-outlined'>
                                    search
                                </i>
                            </span>
                            <input placeholder='Tìm kiếm' />
                        </div>
                    </Col>
                    <Col lg={8}>
                        <Row className={classNames(Styles.search_menu)}>
                            <Col lg={4} xs={12} className='mb-2'>
                                <Select
                                    options={SelectFilterTypeProject}
                                    placeholder='Loại hình'
                                    value={type}
                                    onChange={onType}
                                    isClearable
                                />
                            </Col>
                            <Col lg={4} xs={6}>
                                <Select
                                    options={SelectFilterStatusProject}
                                    placeholder='Trạng thái'
                                    value={status}
                                    onChange={onStatus}
                                    isClearable
                                />
                            </Col>
                            <Col lg={4} xs={6}>
                                <Select
                                    options={SelectFilterPricesProject}
                                    placeholder='Mức giá'
                                    value={prices}
                                    onChange={onPrices}
                                    isClearable
                                />
                            </Col>
                        </Row>
                        <Row className={classNames(Styles.search_mobile)}>
                            <Col
                                xs={
                                    (region && district) ||
                                    (region && !district)
                                        ? 12
                                        : 6
                                }
                                className='mb-2'
                            >
                                <Select
                                    options={SelectFilterTypeProject}
                                    placeholder='Loại hình'
                                    value={type}
                                    onChange={onType}
                                    isClearable
                                />
                            </Col>
                            <Col
                                xs={6}
                                className={classNames({
                                    'mb-2': region !== undefined,
                                })}
                            >
                                <Select
                                    options={SelectFilterStatusProject}
                                    placeholder='Trạng thái'
                                    value={status}
                                    onChange={onStatus}
                                    isClearable
                                />
                            </Col>
                            <Col
                                xs={6}
                                className={classNames({
                                    'mb-2': region !== undefined,
                                })}
                            >
                                <Select
                                    options={SelectFilterPricesProject}
                                    placeholder='Mức giá'
                                    value={prices}
                                    onChange={onPrices}
                                    isClearable
                                />
                            </Col>
                            <Col xs={6}>
                                <Select
                                    options={regions}
                                    placeholder='Tỉnh/Thành phố'
                                    value={region}
                                    onChange={onRegion}
                                    isClearable
                                />
                            </Col>
                            {region && (
                                <Col xs={6}>
                                    <Select
                                        options={districts}
                                        placeholder='Quận/Huyện'
                                        value={district}
                                        isDisabled={!districts}
                                        isLoading={
                                            !districts && region !== undefined
                                        }
                                        onChange={onDistrict}
                                        isClearable
                                    />
                                </Col>
                            )}
                        </Row>
                    </Col>
                    <Col lg={1} className='d-flex align-items-center'>
                        <button
                            className={Styles.search_reset}
                            onClick={handleClickReset}
                        >
                            <i className='material-icons-outlined'>sync</i>
                        </button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Index;
