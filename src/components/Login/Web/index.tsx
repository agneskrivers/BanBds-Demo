import React, {
    FunctionComponent,
    useState,
    useEffect,
    useContext,
    useRef,
} from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import ReactCodeInput from 'react-code-input';
import {
    Modal,
    InputGroup,
    Form,
    Button,
    Image,
    FloatingLabel,
    CloseButton,
    Spinner,
} from 'react-bootstrap';

// Styles
import Styles from './styles/index.module.scss';

// Configs
import {
    regexPhoneNumber,
    LimitFailedOTP,
    LimitRenewOTP,
} from '@client/configs';

// Context
import { Context } from '@client/context/Web';

// Helpers
import { formatPhoneNumber } from '@client/helpers';

// Services
import services from '@client/services';

// Interfaces
import type { IUserCreate } from '@interfaces';

// Type
type Event = React.ChangeEvent<HTMLInputElement>;

// Props
interface Props {
    onClose(): void;
}

const Index: FunctionComponent<Props> = ({ onClose }) => {
    // States
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [isFocus, setIsFocus] = useState<boolean>(true);

    const [isPhoneLoading, setIsPhoneLoading] = useState<boolean>(false);
    const [isConfirmLoading, setIsConfirmLoading] = useState<boolean>(false);
    const [isResendLoading, setIsResendLoading] = useState<boolean>(false);
    const [isCreateLoading, setIsCreateLoading] = useState<boolean>(false);

    const [isModalPhone, setIsModalPhone] = useState<boolean>(true);
    const [isModalConfirm, setIsModalConfirm] = useState<boolean>(false);
    const [isModalCreate, setIsModalCreate] = useState<boolean>(false);

    const [isValidPhone, setIsValidPhone] = useState<boolean>(true);
    const [isValidPhoneRegex, setIsValidPhoneRegex] = useState<boolean>(false);
    const [isValidOtp, setIsValidOtp] = useState<boolean>(true);

    const [phoneNumber, setPhoneNumber] = useState<string>('098311242');
    const [otp, setOtp] = useState<string>();
    const [countTime, setCountTime] = useState<number>(59);

    const [avatar, setAvatar] = useState<string | null>(null);
    const [avatarTemp, setAvatarTemp] = useState<File>();
    const [fullName, setFullName] = useState<string>();
    const [birthday, setBirthday] = useState<number>();
    const [address, setAddress] = useState<string>();

    const [renew, setRenew] = useState<number>(0);
    const [failed, setFailed] = useState<number>(0);

    // Hooks
    const { onNotification, onLogin } = useContext(Context);

    // Ref
    const inputRef = useRef<HTMLInputElement | null>(null);

    // Effects
    useEffect(() => {
        setIsLoaded(true);
    }, []);
    useEffect(() => {
        const handleFocus = () => setIsFocus(true);

        window.addEventListener('focus', handleFocus);

        return () => window.removeEventListener('focus', handleFocus);
    }, []);
    useEffect(() => {
        const handleBlur = () => setIsFocus(false);

        window.addEventListener('blur', handleBlur);

        return () => window.removeEventListener('blur', handleBlur);
    });
    useEffect(() => {
        let id: NodeJS.Timeout;

        if (phoneNumber) {
            id = setTimeout(
                () => setIsValidPhoneRegex(regexPhoneNumber.test(phoneNumber)),
                500
            );
        }

        return () => clearTimeout(id);
    }, [phoneNumber]);
    useEffect(() => {
        let id: NodeJS.Timeout;

        if (isFocus && isModalConfirm) {
            if (countTime < 0) return;

            id = setTimeout(
                () => setCountTime((preCount) => preCount - 1),
                1000
            );
        }

        return () => clearTimeout(id);
    }, [isModalCreate, countTime, isFocus]);
    useEffect(() => {
        const controller = new AbortController();

        const getData = async (signal: AbortSignal, phone: string) => {
            if (failed >= LimitFailedOTP) {
                setIsPhoneLoading(false);

                onNotification(
                    'B???n ???? nh???p sai m?? x??c nh???n qu?? nhi???u. Vui l??ng th??? l???i sau 30p n???a!',
                    'info'
                );

                onClose();

                return;
            }

            if (renew >= LimitRenewOTP) {
                setIsPhoneLoading(false);

                onNotification(
                    'B???n ???? y??u c???u qu?? nhi???u m?? x??c nh???n. Vui l??ng quay l???i v??o ng??y mai!',
                    'info'
                );

                onClose();

                return;
            }

            const data = await services.login.send(signal, phone);

            if (!data) throw new Error();

            if (data === 'BadRequest') {
                setIsPhoneLoading(false);

                onNotification(
                    'G???i m?? x??c nh???n kh??ng th??nh c??ng. Vui l??ng th??? l???i!',
                    'warning'
                );

                return;
            }

            if (data === 'Failed') {
                setIsPhoneLoading(false);

                onNotification(
                    'B???n ???? nh???p sai m?? x??c nh???n qu?? nhi???u. Vui l??ng th??? l???i sau 30p n???a!',
                    'info'
                );

                return;
            }

            if (data === 'Renew') {
                setIsPhoneLoading(false);

                onNotification(
                    'B???n ???? y??u c???u qu?? nhi???u m?? x??c nh???n. Vui l??ng quay l???i v??o ng??y mai!',
                    'info'
                );

                return;
            }

            alert(`M?? OTP c???a b???n l??: ${data.otp}`);

            setIsModalPhone(false);
            setIsModalConfirm(true);
        };

        if (
            isPhoneLoading &&
            phoneNumber &&
            isValidPhone &&
            isValidPhoneRegex
        ) {
            getData(controller.signal, phoneNumber).catch(() => {
                setIsPhoneLoading(false);

                onNotification(
                    'M??y ch??? b??? l???i. Vui l??ng th??? l???i sau!',
                    'danger'
                );
            });
        } else {
            setIsPhoneLoading(false);
        }

        return () => controller.abort();
    }, [isPhoneLoading]);
    useEffect(() => {
        const controller = new AbortController();

        const getData = async (signal: AbortSignal, phone: string) => {
            if (failed >= LimitFailedOTP) {
                setIsResendLoading(false);

                onNotification(
                    'B???n ???? nh???p sai m?? x??c nh???n qu?? nhi???u. Vui l??ng th??? l???i sau 30p n???a!',
                    'info'
                );

                onClose();

                return;
            }

            if (renew >= LimitRenewOTP) {
                setIsResendLoading(false);

                onNotification(
                    'B???n ???? y??u c???u qu?? nhi???u m?? x??c nh???n. Vui l??ng quay l???i v??o ng??y mai!',
                    'info'
                );

                onClose();

                return;
            }

            const data = await services.login.send(signal, phone);

            if (!data) throw new Error();

            if (data === 'BadRequest') {
                setIsResendLoading(false);

                onNotification(
                    'G???i m?? x??c nh???n kh??ng th??nh c??ng. Vui l??ng th??? l???i!',
                    'warning'
                );

                return;
            }

            if (data === 'Failed') {
                setIsResendLoading(false);

                onNotification(
                    'B???n ???? nh???p sai m?? x??c nh???n qu?? nhi???u. Vui l??ng th??? l???i sau 30p n???a!',
                    'info'
                );

                return;
            }

            if (data === 'Renew') {
                setIsResendLoading(false);

                onNotification(
                    'B???n ???? y??u c???u qu?? nhi???u m?? x??c nh???n. Vui l??ng quay l???i v??o ng??y mai!',
                    'info'
                );

                return;
            }

            setIsResendLoading(false);
            setRenew((preRenew) => preRenew + 1);

            onNotification('G???i m?? x??c nh???n th??nh c??ng!');
        };

        if (
            isResendLoading &&
            phoneNumber &&
            isValidPhone &&
            isValidPhoneRegex
        ) {
            getData(controller.signal, phoneNumber).catch(() => {
                setIsResendLoading(false);

                onNotification(
                    'M??y ch??? b??? l???i. Vui l??ng th??? l???i sau!',
                    'danger'
                );
            });
        } else {
            setIsResendLoading(false);
        }

        return () => controller.abort();
    }, [isResendLoading]);
    useEffect(() => {
        if (
            phoneNumber &&
            phoneNumber.length === 10 &&
            otp &&
            otp.length === 4 &&
            isValidOtp &&
            isValidPhone &&
            isValidPhoneRegex
        ) {
            setIsConfirmLoading(true);
        }
    }, [phoneNumber, otp, isValidOtp, isValidPhone, isValidPhoneRegex]);
    useEffect(() => {
        const controller = new AbortController();

        const login = async (signal: AbortSignal) => {
            const data = await services.user.info(signal);

            if (!data) throw new Error();

            if (data === 'Unauthorized') {
                setIsConfirmLoading(false);

                onNotification('????ng nh???p b??? l???i. Vui l??ng th??? l???i!', 'danger');

                return;
            }

            if (data === 'BadRequest') {
                setIsConfirmLoading(false);

                onNotification(
                    '????ng nh???p kh??ng th??nh c??ng. Vui l??ng th??? l???i!',
                    'danger'
                );

                return;
            }

            onNotification('????ng nh???p th??nh c??ng!');

            onLogin(data);
            handleReset();
            setIsConfirmLoading(false);
            setIsModalConfirm(false);

            onClose();
        };

        const getData = async (
            signal: AbortSignal,
            phone: string,
            value: string
        ) => {
            if (failed >= LimitFailedOTP) {
                setIsConfirmLoading(false);

                onNotification(
                    'B???n ???? nh???p sai m?? x??c nh???n qu?? nhi???u. Vui l??ng th??? l???i sau 30p n???a!',
                    'info'
                );

                onClose();

                return;
            }

            if (renew >= LimitRenewOTP) {
                setIsConfirmLoading(false);

                onNotification(
                    'B???n ???? y??u c???u qu?? nhi???u m?? x??c nh???n. Vui l??ng quay l???i v??o ng??y mai!',
                    'info'
                );

                onClose();

                return;
            }

            const data = await services.login.check(signal, phone, value);

            if (data === null) throw new Error();

            if (data === 'BadRequest') {
                setIsConfirmLoading(false);

                onNotification(
                    'M?? x??c nh???n kh??ng ????ng. Vui l??ng th??? l???i!',
                    'warning'
                );

                setOtp('');

                return;
            }

            if (data === 'Token') {
                setIsConfirmLoading(false);

                onNotification(
                    'C?? l???i x???y ra khi ????ng nh???p. Vui l??ng th??? l???i sau!'
                );

                onClose();

                return;
            }

            if (!data) {
                setIsConfirmLoading(false);
                setIsModalConfirm(false);
                setIsModalCreate(true);

                return;
            }

            return login(signal);
        };

        if (
            isConfirmLoading &&
            phoneNumber &&
            isValidOtp &&
            isValidPhone &&
            isValidPhoneRegex &&
            otp
        ) {
            getData(controller.signal, phoneNumber, otp).catch(() => {
                setIsConfirmLoading(false);

                onNotification('M??y ch??? b??? l???i. Vui l??ng th??? l???i!', 'danger');

                return;
            });
        } else {
            setIsConfirmLoading(false);
        }

        return () => controller.abort();
    }, [isConfirmLoading]);
    useEffect(() => {
        const controller = new AbortController();

        const getData = async (signal: AbortSignal, body: FormData) => {
            const result = await services.common.images.upload(signal, body);

            if (!result) throw new Error();

            if (result === 'ImageFormat') {
                setAvatarTemp(undefined);

                onNotification(
                    '?????nh d???ng ???nh kh??ng h??? tr???. Vui l??ng ch???n l???i!',
                    'warning'
                );

                return;
            }

            if (result === 'ImageToBig') {
                setAvatarTemp(undefined);

                onNotification(
                    'Dung l?????ng ???nh qu?? l???n. Vui l??ng ch???n ???nh kh??c!',
                    'warning'
                );

                return;
            }

            if (result === 'NotFound') {
                setAvatarTemp(undefined);

                onNotification(
                    'Kh??ng c?? h???nh ???nh. Vui l??ng th??? l???i!',
                    'warning'
                );

                return;
            }

            if (result === 'Unauthorized') throw new Error();

            setAvatarTemp(undefined);
            setAvatar(result.data);

            onNotification('T???i h??nh ???nh th??nh c??ng');
        };

        if (avatarTemp) {
            const body = new FormData();

            body.append('file', avatarTemp);
            body.append('avatar', 'true');

            getData(controller.signal, body).catch(() => {
                setAvatarTemp(undefined);

                onNotification(
                    'M??y ch??? b??? l???i. Vui l??ng th??? l???i sau!',
                    'danger'
                );
            });
        }

        return () => controller.abort();
    }, [avatarTemp]);
    useEffect(() => {
        const controller = new AbortController();

        const login = async (signal: AbortSignal) => {
            const result = await services.user.info(signal);

            if (!result) throw new Error();

            if (result === 'Unauthorized') {
                setIsCreateLoading(false);

                onNotification('????ng nh???p b??? l???i. Vui l??ng th??? l???i!', 'danger');

                return;
            }

            if (result === 'BadRequest') {
                setIsCreateLoading(false);

                onNotification(
                    '????ng nh???p kh??ng th??nh c??ng. Vui l??ng th??? l???i!',
                    'danger'
                );

                return;
            }

            setIsCreateLoading(false);
            onLogin(result);
            handleReset();
            setIsModalCreate(false);

            onNotification('T???o t??i kho???n th??nh c??ng!');
        };

        const getData = async (signal: AbortSignal, body: IUserCreate) => {
            const result = await services.user.create(signal, body);

            if (!result) throw new Error();

            if (result === 'BadRequest') {
                setIsCreateLoading(false);

                onNotification(
                    'T???o t??i kho???n kh??ng th??nh c??ng. Vui l??ng th??? l???i!',
                    'warning'
                );

                return;
            }

            return login(signal);
        };

        if (isCreateLoading && phoneNumber && address && birthday && fullName) {
            const body: IUserCreate = {
                address,
                avatar,
                birthday,
                fullName,
                phoneNumber,
            };

            getData(controller.signal, body).catch(() => {
                setIsCreateLoading(false);

                onNotification(
                    'M??y ch??? b??? l???i. Vui l??ng th??? l???i sau!',
                    'danger'
                );
            });
        } else {
            setIsCreateLoading(false);
        }

        return () => controller.abort();
    }, [isCreateLoading]);

    // Handles
    const handleReset = () => {
        setIsPhoneLoading(false);
        setIsConfirmLoading(false);
        setIsResendLoading(false);
        setIsCreateLoading(false);
        setIsModalPhone(true);
        setIsModalConfirm(false);
        setIsModalCreate(false);
        setIsValidPhone(true);
        setIsValidPhoneRegex(true);
        setIsValidOtp(true);
        setPhoneNumber('');
        setOtp(undefined);
        setCountTime(59);
        setRenew(0);
        setFailed(0);
        setAvatar(null);
        setAvatarTemp(undefined);
        setFullName(undefined);
        setBirthday(undefined);
        setAddress(undefined);
    };
    const handleCheckText = (str: string): boolean => {
        for (const char of str) {
            if (isNaN(parseInt(char))) return false;
        }

        return true;
    };

    const handleCloseModalConfirm = () => {
        if (!otp || otp.length !== 4 || !isValidOtp || !isConfirmLoading) {
            handleReset();
            setIsModalConfirm(false);
            onClose();
        }
    };

    const handleChangePhoneNumber = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { value } = e.target;

        const isValid = handleCheckText(value);

        setIsValidPhone(isValid);
        setPhoneNumber(value);
    };
    const handleChangeOtp = (value: string) => {
        if (value.length <= 4) {
            const isValid = handleCheckText(value);

            setIsValidOtp(isValid);
            setOtp(value);
        }
    };
    const handleChangeFullName = (e: Event) => setFullName(e.target.value);
    const handleChangeAddress = (e: Event) => setAddress(e.target.value);
    const handleChangeBirthday = (e: Event) => {
        const { value } = e.target;

        if (!value) return setBirthday(undefined);

        const time = new Date(value).getTime();

        setBirthday(time);
    };
    const handleChangeAvatar = (e: Event) => {
        if (e.target.files) {
            const file = e.target.files[0];

            setAvatarTemp(file);
        }
    };

    const handleClickPhone = () => {
        if (isLoaded && isValidOtp && isValidPhone && phoneNumber)
            return setIsPhoneLoading(true);
    };
    const handleClickResend = () => {
        if (isLoaded && isValidOtp && isValidPhone && phoneNumber)
            return setIsResendLoading(true);
    };
    const handleClickUpdateAvatar = () => {
        if (avatarTemp === undefined) return inputRef.current?.click();
    };
    const handleClickCreate = () => {
        if (fullName && birthday && address) return setIsCreateLoading(true);
    };

    if (!isLoaded) return null;

    return (
        <>
            <Modal show={isModalPhone} centered>
                <Modal.Body className={Styles.box}>
                    <div className={Styles.box_close}>
                        <CloseButton />
                    </div>
                    <div className={Styles.box_content}>
                        <p className={Styles.box_title}>Xin ch??o</p>
                        <p className={Styles.box_description}>
                            ????ng nh???p ho???c t???o t??i kho???n
                        </p>
                        <InputGroup className={Styles.box_input}>
                            <InputGroup.Text>
                                <i className='material-icons'>smartphone</i>
                            </InputGroup.Text>
                            <Form.Control
                                placeholder='S??? ??i???n tho???i'
                                onChange={handleChangePhoneNumber}
                            />
                        </InputGroup>
                        {!isValidPhone && (
                            <p className='text-danger h5 mb-4'>
                                S??? ??i???n tho???i kh??ng ????ng!
                            </p>
                        )}
                        <Button
                            className={Styles.box_btn}
                            variant='primary'
                            disabled={
                                !phoneNumber ||
                                !isValidPhoneRegex ||
                                !isValidPhone
                            }
                            onClick={handleClickPhone}
                        >
                            {isPhoneLoading ? (
                                <Spinner variant='light' />
                            ) : (
                                'Ti???p t???c'
                            )}
                        </Button>
                        <p className={Styles.box_term}>
                            B???ng vi???c ti???p t???c, b???n ???? ?????ng ?? v???i
                            <br />
                            <Link href='/dieu-khoan-su-dung'>
                                ??i???u kho???n s??? d???ng
                            </Link>{' '}
                            t??i kho???n.
                        </p>
                    </div>
                </Modal.Body>
            </Modal>
            {phoneNumber && (
                <>
                    <Modal
                        show={isModalConfirm}
                        onHide={handleCloseModalConfirm}
                        centered
                        backdrop='static'
                    >
                        <Modal.Body className={Styles.box}>
                            {!isConfirmLoading && (
                                <div className={Styles.box_close}>
                                    <CloseButton
                                        onClick={handleCloseModalConfirm}
                                    />
                                </div>
                            )}
                            <div className={Styles.box_content}>
                                <p className={Styles.box_title}>
                                    Nh???p m?? x??c nh???n
                                </p>
                                <p className={Styles.box_description}>
                                    {`M?? x??c minh v???a g???i v??o s??? ??i???n tho???i ${formatPhoneNumber(
                                        phoneNumber
                                    )} c???a
                                b???n`}
                                </p>
                                <div
                                    className={Styles.box_input}
                                    style={{ marginBottom: 0 }}
                                >
                                    <ReactCodeInput
                                        type='text'
                                        fields={4}
                                        name='confirm'
                                        inputMode='numeric'
                                        onChange={handleChangeOtp}
                                        disabled={
                                            otp !== undefined &&
                                            otp.length === 4 &&
                                            isValidOtp
                                        }
                                        value={otp}
                                    />
                                </div>
                                {!isValidOtp && (
                                    <p className='text-danger py-3 h5'>
                                        M?? x??c nh???n kh??ng h???p l???!
                                    </p>
                                )}
                                <p
                                    className={Styles.box_term}
                                    style={{ marginTop: 0 }}
                                >
                                    Kh??ng nh???n ???????c?{' '}
                                    {countTime >= 0 ? (
                                        `00:${
                                            countTime < 10
                                                ? `0${countTime}`
                                                : countTime
                                        }`
                                    ) : (
                                        <button onClick={handleClickResend}>
                                            G???i l???i m??
                                        </button>
                                    )}
                                </p>
                                {isConfirmLoading && (
                                    <Spinner variant='primary' />
                                )}
                            </div>
                        </Modal.Body>
                    </Modal>
                    <Modal
                        show={isModalCreate}
                        centered
                        backdrop='static'
                        keyboard={false}
                    >
                        <Modal.Body className={Styles.box}>
                            <div className={Styles.box_close}>
                                <CloseButton />
                            </div>
                            <div
                                className='d-flex align-items-center mb-4'
                                style={{
                                    cursor:
                                        avatarTemp === undefined
                                            ? 'pointer'
                                            : 'not-allowed',
                                }}
                                onClick={handleClickUpdateAvatar}
                            >
                                <Image
                                    src={
                                        avatar === null
                                            ? '/images/common/avatar.png'
                                            : `/temp/${avatar}`
                                    }
                                    width={100}
                                    height={100}
                                    roundedCircle
                                />
                                <div className={Styles.upload}>
                                    <div
                                        className={classNames(
                                            'm-0 d-flex algin-items-center justify-content-center',
                                            Styles.upload_icon
                                        )}
                                    >
                                        {avatarTemp ? (
                                            <Spinner size='sm' />
                                        ) : (
                                            <>
                                                <i className='material-icons'>
                                                    downloading
                                                </i>
                                                <span>T???i ???nh l??n</span>
                                            </>
                                        )}
                                    </div>
                                    <p className='m-0'>
                                        Ch??? t???i ???nh l???n nh???t l?? 10mb
                                    </p>
                                </div>
                            </div>
                            <input
                                type='file'
                                style={{ display: 'none' }}
                                ref={inputRef}
                                onChange={handleChangeAvatar}
                            />
                            <FloatingLabel
                                className='mb-4'
                                label='S??? ??i???n tho???i'
                            >
                                <Form.Control
                                    disabled
                                    value={formatPhoneNumber(phoneNumber)}
                                />
                            </FloatingLabel>
                            <FloatingLabel className='mb-4' label='H??? v?? t??n'>
                                <Form.Control
                                    placeholder='Enter...'
                                    onChange={handleChangeFullName}
                                />
                            </FloatingLabel>
                            <FloatingLabel className='mb-4' label='Ng??y sinh'>
                                <Form.Control
                                    type='date'
                                    placeholder='Enter...'
                                    onChange={handleChangeBirthday}
                                />
                            </FloatingLabel>
                            <FloatingLabel className='mb-4' label='?????a ch???'>
                                <Form.Control
                                    placeholder='Enter...'
                                    onChange={handleChangeAddress}
                                />
                            </FloatingLabel>
                            <Button
                                className={Styles.box_btn}
                                variant='primary'
                                disabled={!fullName || !birthday || !address}
                                onClick={handleClickCreate}
                            >
                                {isCreateLoading ? (
                                    <Spinner />
                                ) : (
                                    'T???o t??i kho???n'
                                )}
                            </Button>
                        </Modal.Body>
                    </Modal>
                </>
            )}
        </>
    );
};

export default Index;
