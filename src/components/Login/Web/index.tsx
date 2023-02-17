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
                    'Bạn đã nhập sai mã xác nhận quá nhiều. Vui lòng thử lại sau 30p nữa!',
                    'info'
                );

                onClose();

                return;
            }

            if (renew >= LimitRenewOTP) {
                setIsPhoneLoading(false);

                onNotification(
                    'Bạn đã yêu cầu quá nhiều mã xác nhận. Vui lòng quay lại vào ngày mai!',
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
                    'Gửi mã xác nhận không thành công. Vui lòng thử lại!',
                    'warning'
                );

                return;
            }

            if (data === 'Failed') {
                setIsPhoneLoading(false);

                onNotification(
                    'Bạn đã nhập sai mã xác nhận quá nhiều. Vui lòng thử lại sau 30p nữa!',
                    'info'
                );

                return;
            }

            if (data === 'Renew') {
                setIsPhoneLoading(false);

                onNotification(
                    'Bạn đã yêu cầu quá nhiều mã xác nhận. Vui lòng quay lại vào ngày mai!',
                    'info'
                );

                return;
            }

            alert(`Mã OTP của bạn là: ${data.otp}`);

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
                    'Máy chủ bị lỗi. Vui lòng thử lại sau!',
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
                    'Bạn đã nhập sai mã xác nhận quá nhiều. Vui lòng thử lại sau 30p nữa!',
                    'info'
                );

                onClose();

                return;
            }

            if (renew >= LimitRenewOTP) {
                setIsResendLoading(false);

                onNotification(
                    'Bạn đã yêu cầu quá nhiều mã xác nhận. Vui lòng quay lại vào ngày mai!',
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
                    'Gửi mã xác nhận không thành công. Vui lòng thử lại!',
                    'warning'
                );

                return;
            }

            if (data === 'Failed') {
                setIsResendLoading(false);

                onNotification(
                    'Bạn đã nhập sai mã xác nhận quá nhiều. Vui lòng thử lại sau 30p nữa!',
                    'info'
                );

                return;
            }

            if (data === 'Renew') {
                setIsResendLoading(false);

                onNotification(
                    'Bạn đã yêu cầu quá nhiều mã xác nhận. Vui lòng quay lại vào ngày mai!',
                    'info'
                );

                return;
            }

            setIsResendLoading(false);
            setRenew((preRenew) => preRenew + 1);

            onNotification('Gửi mã xác nhận thành công!');
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
                    'Máy chủ bị lỗi. Vui lòng thử lại sau!',
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

                onNotification('Đăng nhập bị lỗi. Vui lòng thử lại!', 'danger');

                return;
            }

            if (data === 'BadRequest') {
                setIsConfirmLoading(false);

                onNotification(
                    'Đăng nhập không thành công. Vui lòng thử lại!',
                    'danger'
                );

                return;
            }

            onNotification('Đăng nhập thành công!');

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
                    'Bạn đã nhập sai mã xác nhận quá nhiều. Vui lòng thử lại sau 30p nữa!',
                    'info'
                );

                onClose();

                return;
            }

            if (renew >= LimitRenewOTP) {
                setIsConfirmLoading(false);

                onNotification(
                    'Bạn đã yêu cầu quá nhiều mã xác nhận. Vui lòng quay lại vào ngày mai!',
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
                    'Mã xác nhận không đúng. Vui lòng thử lại!',
                    'warning'
                );

                setOtp('');

                return;
            }

            if (data === 'Token') {
                setIsConfirmLoading(false);

                onNotification(
                    'Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau!'
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

                onNotification('Máy chủ bị lỗi. Vui lòng thử lại!', 'danger');

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
                    'Định dạng ảnh không hỗ trợ. Vui lòng chọn lại!',
                    'warning'
                );

                return;
            }

            if (result === 'ImageToBig') {
                setAvatarTemp(undefined);

                onNotification(
                    'Dung lượng ảnh quá lớn. Vui lòng chọn ảnh khác!',
                    'warning'
                );

                return;
            }

            if (result === 'NotFound') {
                setAvatarTemp(undefined);

                onNotification(
                    'Không có hỉnh ảnh. Vui lòng thử lại!',
                    'warning'
                );

                return;
            }

            if (result === 'Unauthorized') throw new Error();

            setAvatarTemp(undefined);
            setAvatar(result.data);

            onNotification('Tải hình ảnh thành công');
        };

        if (avatarTemp) {
            const body = new FormData();

            body.append('file', avatarTemp);
            body.append('avatar', 'true');

            getData(controller.signal, body).catch(() => {
                setAvatarTemp(undefined);

                onNotification(
                    'Máy chủ bị lỗi. Vui lòng thử lại sau!',
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

                onNotification('Đăng nhập bị lỗi. Vui lòng thử lại!', 'danger');

                return;
            }

            if (result === 'BadRequest') {
                setIsCreateLoading(false);

                onNotification(
                    'Đăng nhập không thành công. Vui lòng thử lại!',
                    'danger'
                );

                return;
            }

            setIsCreateLoading(false);
            onLogin(result);
            handleReset();
            setIsModalCreate(false);

            onNotification('Tạo tài khoản thành công!');
        };

        const getData = async (signal: AbortSignal, body: IUserCreate) => {
            const result = await services.user.create(signal, body);

            if (!result) throw new Error();

            if (result === 'BadRequest') {
                setIsCreateLoading(false);

                onNotification(
                    'Tạo tài khoản không thành công. Vui lòng thử lại!',
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
                    'Máy chủ bị lỗi. Vui lòng thử lại sau!',
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
                        <p className={Styles.box_title}>Xin chào</p>
                        <p className={Styles.box_description}>
                            Đăng nhập hoặc tạo tài khoản
                        </p>
                        <InputGroup className={Styles.box_input}>
                            <InputGroup.Text>
                                <i className='material-icons'>smartphone</i>
                            </InputGroup.Text>
                            <Form.Control
                                placeholder='Số điện thoại'
                                onChange={handleChangePhoneNumber}
                            />
                        </InputGroup>
                        {!isValidPhone && (
                            <p className='text-danger h5 mb-4'>
                                Số điện thoại không đúng!
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
                                'Tiếp tục'
                            )}
                        </Button>
                        <p className={Styles.box_term}>
                            Bằng việc tiếp tục, bạn đã đồng ý với
                            <br />
                            <Link href='/dieu-khoan-su-dung'>
                                điều khoản sử dụng
                            </Link>{' '}
                            tài khoản.
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
                                    Nhập mã xác nhận
                                </p>
                                <p className={Styles.box_description}>
                                    {`Mã xác minh vừa gửi vào số điện thoại ${formatPhoneNumber(
                                        phoneNumber
                                    )} của
                                bạn`}
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
                                        Mã xác nhận không hợp lệ!
                                    </p>
                                )}
                                <p
                                    className={Styles.box_term}
                                    style={{ marginTop: 0 }}
                                >
                                    Không nhận được?{' '}
                                    {countTime >= 0 ? (
                                        `00:${
                                            countTime < 10
                                                ? `0${countTime}`
                                                : countTime
                                        }`
                                    ) : (
                                        <button onClick={handleClickResend}>
                                            Gửi lại mã
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
                                                <span>Tải ảnh lên</span>
                                            </>
                                        )}
                                    </div>
                                    <p className='m-0'>
                                        Chỉ tải ảnh lớn nhất là 10mb
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
                                label='Số điện thoại'
                            >
                                <Form.Control
                                    disabled
                                    value={formatPhoneNumber(phoneNumber)}
                                />
                            </FloatingLabel>
                            <FloatingLabel className='mb-4' label='Họ và tên'>
                                <Form.Control
                                    placeholder='Enter...'
                                    onChange={handleChangeFullName}
                                />
                            </FloatingLabel>
                            <FloatingLabel className='mb-4' label='Ngày sinh'>
                                <Form.Control
                                    type='date'
                                    placeholder='Enter...'
                                    onChange={handleChangeBirthday}
                                />
                            </FloatingLabel>
                            <FloatingLabel className='mb-4' label='Địa chỉ'>
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
                                    'Tạo tài khoản'
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
