import React, {
    FunctionComponent,
    useState,
    useEffect,
    useContext,
} from 'react';
import { Form, Row, Col, Button, Spinner } from 'react-bootstrap';
import Select, { SingleValue } from 'react-select';

// Styles
import Styles from '../styles/index.module.scss';

// Components
import { LoginComponent } from '@client/components';

// Context
import { Context } from '@client/context/Web';

// Services
import services from '@client/services';

// Interfaces
import type { ISelect, IRequestCreate } from '@interfaces';

const Index: FunctionComponent = () => {
    // States
    const [isValidPrices, setIsValidPrices] = useState<boolean>(false);
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const [isSave, setIsSave] = useState<boolean>(false);

    const [districts, setDistricts] = useState<ISelect[]>();
    const [wards, setWards] = useState<ISelect[]>();

    const [content, setContent] = useState<string>();
    const [region, setRegion] = useState<ISelect>();
    const [district, setDistrict] = useState<ISelect>();
    const [ward, setWard] = useState<ISelect>();
    const [pricesMin, setPricesMin] = useState<string>();
    const [pricesMax, setPricesMax] = useState<string>();
    const [unit, setUnit] = useState<'million' | 'billion'>();

    // Hooks
    const { user, regions, onNotification, onLogout } = useContext(Context);

    // Effects
    useEffect(() => {
        const controller = new AbortController();

        const getData = async (signal: AbortSignal, id: string) => {
            const result = await services.common.address.districts(signal, id);

            if (!result) throw new Error();

            if (result === 'BadRequest') {
                setRegion(undefined);

                onNotification(
                    'Lấy danh sách Quận/Huyện không thành công. Vui lòng thử lại!',
                    'warning'
                );

                return;
            }

            setDistricts(
                [...result].map(({ districtID, name }) => ({
                    value: districtID,
                    label: name,
                }))
            );
        };

        if (region) {
            getData(controller.signal, region.value).catch(() => {
                setRegion(undefined);

                onNotification('Máy chủ bị lỗi. Vui lòng thử lại!');
            });
        }

        return () => controller.abort();
    }, [region]);
    useEffect(() => {
        const controller = new AbortController();

        const getData = async (signal: AbortSignal, id: string) => {
            const result = await services.common.address.wards(signal, id);

            if (!result) throw new Error();

            if (result === 'BadRequest') {
                setRegion(undefined);

                onNotification(
                    'Lấy danh sách Phường/Xã không thành công. Vui lòng thử lại!',
                    'warning'
                );

                return;
            }

            const selectDefault: ISelect = {
                label: 'Tất cả',
                value: 'all',
            };

            setWards([
                selectDefault,
                ...[...result].map(({ wardID, name }) => ({
                    value: wardID,
                    label: name,
                })),
            ]);
            setWard(selectDefault);
        };

        if (district) {
            getData(controller.signal, district.value).catch(() => {
                setRegion(undefined);

                onNotification('Máy chủ bị lỗi. Vui lòng thử lại!');
            });
        }

        return () => controller.abort();
    }, [district]);
    useEffect(() => {
        const id = setTimeout(() => {
            if (pricesMin && pricesMax) {
                const valuePricesMin = parseFloat(pricesMin);
                const valuePricesMax = parseFloat(pricesMax);

                if (
                    unit === 'billion' &&
                    (valuePricesMax >= 1000 || valuePricesMin >= 1000)
                ) {
                    if (valuePricesMax >= 1000) {
                        const newPricesMax = valuePricesMax / 1000;

                        setPricesMax(newPricesMax.toString());
                    }

                    if (valuePricesMin >= 1000) {
                        const newPricesMin = valuePricesMin / 1000;

                        setPricesMin(newPricesMin.toString());
                    }
                }

                if (
                    (valuePricesMax >= 1000 || valuePricesMin >= 1000) &&
                    unit === 'million'
                ) {
                    setUnit('billion');

                    if (valuePricesMax >= 1000) {
                        const newPricesMax = valuePricesMax / 1000;

                        setPricesMax(newPricesMax.toString());
                    }

                    if (valuePricesMin >= 1000) {
                        const newPricesMin = valuePricesMin / 1000;

                        setPricesMin(newPricesMin.toString());
                    }
                }

                if (
                    unit === 'billion' &&
                    valuePricesMax < 1 &&
                    valuePricesMax < valuePricesMin
                ) {
                    setIsValidPrices(false);
                } else {
                    setIsValidPrices(true);
                }
            }
        }, 500);

        return () => clearTimeout(id);
    }, [pricesMin, pricesMax, unit, isValidPrices]);
    useEffect(() => {
        const controller = new AbortController();

        const getData = async (
            signal: AbortSignal,
            body: Omit<IRequestCreate, 'userID' | 'status'>
        ) => {
            const result = await services.request(signal, body);

            if (!result) throw new Error();

            if (result === 'BadRequest') {
                setIsSave(false);

                onNotification(
                    'Tạo tin đăng không thành công. Vui lòng thử lại!',
                    'warning'
                );

                return;
            }

            if (result === 'Unauthorized') {
                setIsSave(false);

                onNotification('Vui lòng đăng nhập', 'warning');

                if (user) {
                    onLogout();
                }

                setIsLogin(true);

                return;
            }

            setIsSave(false);
            handleReset();
            onNotification('Yêu cầu thành công!', 'success');
        };

        if (isSave && user) {
            if (!content) {
                setIsSave(false);

                onNotification('Vui lòng nhập mô tả!', 'info');

                return;
            }

            if (!pricesMin || isNaN(parseFloat(pricesMin))) {
                setIsSave(false);

                onNotification('Vui lòng nhập khoảng giá!', 'info');

                return;
            }

            if (!pricesMax || isNaN(parseFloat(pricesMax))) {
                setIsSave(false);

                onNotification('Vui lòng nhập khoảng giá!', 'info');

                return;
            }

            if (!region) {
                setIsSave(false);

                onNotification('Vui lòng chọn Tỉnh/Thành phố!', 'info');

                return;
            }

            if (!district) {
                setIsSave(false);

                onNotification('Vui lòng chọn Quận/Huyện!', 'info');

                return;
            }

            const valuePricesMin = parseFloat(pricesMin);
            const valuePricesMax = parseFloat(pricesMax);

            if (
                unit === 'billion' &&
                valuePricesMax < 1 &&
                valuePricesMin < 1000 &&
                valuePricesMin > 1
            ) {
                setIsSave(false);

                onNotification('Vui lòng nhập khoảng giá hợp lệ', 'warning');

                return;
            }

            let convertPricesMin = valuePricesMin;
            let convertPricesMax = valuePricesMax;

            if (unit === 'billion') {
                if (valuePricesMin > valuePricesMax) {
                    convertPricesMax = convertPricesMax * 1000;
                } else {
                    convertPricesMax = convertPricesMax * 1000;
                    convertPricesMin = convertPricesMin * 1000;
                }
            } else {
                if (valuePricesMin > valuePricesMax && valuePricesMax < 10) {
                    convertPricesMax = convertPricesMax * 1000;
                }
            }

            const body: Omit<IRequestCreate, 'userID' | 'status'> = {
                content,
                district: district.value,
                max: convertPricesMax,
                min: convertPricesMin,
                region: region.value,
                ward: ward ? ward.value : 'all',
            };

            getData(controller.signal, body).catch(() => {
                setIsSave(false);
            });
        } else {
            setIsSave(false);
        }

        return () => controller.abort();
    }, [isSave]);

    // Handles
    const handleCloseLogin = () => setIsLogin(false);
    const handleReset = () => {
        setDistricts(undefined);
        setWards(undefined);
        setContent(undefined);
        setRegion(undefined);
        setDistrict(undefined);
        setWard(undefined);
        setPricesMin(undefined);
        setPricesMax(undefined);
        setUnit('million');
    };

    const handleChangeContent = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
        setContent(encodeURI(e.target.value));
    const handleChangePricesMin = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        if (isNaN(parseFloat(value))) return setPricesMin('');

        setPricesMin(value);
    };
    const handleChangePricesMax = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        if (isNaN(parseFloat(value))) return setPricesMax('');

        setPricesMax(value);
    };

    const handleSelectRegion = (value: SingleValue<ISelect>) => {
        if (value) setRegion(value);
    };
    const handleSelectDistrict = (value: SingleValue<ISelect>) => {
        if (value) setDistrict(value);
    };
    const handleSelectWard = (value: SingleValue<ISelect>) => {
        if (value) setWard(value);
    };
    const handleSelectUnit = (e: React.ChangeEvent<HTMLSelectElement>) =>
        setUnit(e.target.value as 'million' | 'billion');

    const handleClickSave = () => {
        if (user) return setIsSave(true);

        setIsLogin(true);
    };

    return (
        <>
            <div className={Styles.box}>
                <Form className='mb-4'>
                    <Form.Label>Mô tả</Form.Label>
                    <Form.Control
                        as='textarea'
                        placeholder='Mô tả...'
                        value={content ? decodeURI(content) : undefined}
                        onChange={handleChangeContent}
                    />
                </Form>
                <Form className='mb-4'>
                    <Form.Label>Vị trí</Form.Label>
                    <Row>
                        <Col lg={4}>
                            <Select
                                options={regions}
                                placeholder='Tỉnh/Thành phố'
                                value={region}
                                onChange={handleSelectRegion}
                            />
                        </Col>
                        <Col lg={4} className='mt-2 mt-lg-0'>
                            <Select
                                options={districts ? districts : []}
                                placeholder='Quận/Huyện'
                                isDisabled={!districts}
                                value={district}
                                onChange={handleSelectDistrict}
                            />
                        </Col>
                        <Col lg={4} className='mt-2 mt-lg-0'>
                            <Select
                                options={wards ? wards : []}
                                placeholder='Phường/Xã'
                                value={ward}
                                isDisabled={!wards}
                                onChange={handleSelectWard}
                            />
                        </Col>
                    </Row>
                </Form>
                <Form className='mb-4'>
                    <Form.Label>Khoảng giá</Form.Label>
                    <div className='d-flex align-items-center'>
                        <Form.Control
                            placeholder='Từ'
                            style={{ flex: 2 }}
                            value={pricesMin}
                            onChange={handleChangePricesMin}
                        />
                        <span className='mx-3'>~</span>
                        <Form.Control
                            style={{ flex: 2 }}
                            placeholder='Từ'
                            value={pricesMax}
                            onChange={handleChangePricesMax}
                        />
                        <Form.Select
                            className='ms-3'
                            style={{ flex: 1 }}
                            onChange={handleSelectUnit}
                        >
                            <option value='million'>Triệu</option>
                            <option value='billion'>Tỷ</option>
                        </Form.Select>
                    </div>
                    {isValidPrices && (
                        <p className='text-danger m-0 text-center mt-2'>
                            Phạm vi giá thấp không thể lớn hơn phạm vi giá cao
                        </p>
                    )}
                </Form>
                <div className={Styles.post}>
                    <Button
                        variant='primary'
                        disabled={
                            !content ||
                            !region ||
                            !district ||
                            !pricesMin ||
                            !pricesMax
                        }
                        onClick={handleClickSave}
                    >
                        {isSave && user ? (
                            <Spinner />
                        ) : user ? (
                            'Yêu cầu'
                        ) : (
                            'Đăng nhập để tiếp tục'
                        )}
                    </Button>
                </div>
            </div>
            {isLogin && <LoginComponent.Web onClose={handleCloseLogin} />}
        </>
    );
};

export default Index;
