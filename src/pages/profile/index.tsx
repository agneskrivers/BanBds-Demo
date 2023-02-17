/* eslint-disable indent */
import React, { useState, useEffect, useContext, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import classNames from 'classnames';
import dayjs from 'dayjs';
import Image from 'next/image';
import Head from 'next/head';
import { useRouter } from 'next/router';

// Styles
import Styles from '@client/scss/pages/profile/index.module.scss';

// Context
import { Context } from '@client/context/Web';

// Helpers
import { formatPhoneNumber } from '@client/helpers';

// Layouts
import { WebLayout } from '@client/layouts';

// Services
import services from '@client/services';

// Interfaces
import type { NextPageWithLayout, IUserUpdateInfo } from '@interfaces';

// Type
type Event = React.ChangeEvent<HTMLInputElement>;

const Index: NextPageWithLayout = () => {
    // States
    const [isSave, setIsSave] = useState<boolean>(false);

    const [avatar, setAvatar] = useState<string>();
    const [avatarTemp, setAvatarTemp] = useState<File>();
    const [fullName, setFullName] = useState<string>();
    const [birthday, setBirthday] = useState<number>();
    const [address, setAddress] = useState<string>();

    // Ref
    const inputRef = useRef<HTMLInputElement | null>(null);

    // Hooks
    const { user, onNotification, onLogout, onUpdateUser } =
        useContext(Context);
    const router = useRouter();

    // Effects
    useEffect(() => {
        if (!user) {
            router.push('/');
        }
    }, []);
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

            if (result === 'Unauthorized') {
                setAvatarTemp(undefined);

                onLogout();

                onNotification('Bạn không có quyền!', 'danger');

                router.push('/');

                return;
            }

            onNotification('Tải ảnh đại diện thành công!', 'success');

            setAvatar(result.data);
            setAvatarTemp(undefined);
        };

        if (avatarTemp) {
            const body = new FormData();

            body.append('file', avatarTemp);
            body.append('avatar', 'true');

            getData(controller.signal, body).catch(() => {
                setAvatarTemp(undefined);

                onNotification('Máy chủ bị lỗi. Vui lòng thử lại!', 'danger');
            });
        }

        return () => controller.abort();
    }, [avatarTemp]);
    useEffect(() => {
        const controller = new AbortController();

        const getData = async (signal: AbortSignal, body: IUserUpdateInfo) => {
            const result = await services.user.update(signal, body);

            if (!result) throw new Error();

            if (result === 'BadRequest') {
                setIsSave(false);

                onNotification(
                    'Cập nhập thông tin không thành công. Vui lòng thử lại!',
                    'warning'
                );

                return;
            }

            if (result === 'Unauthorized') {
                setIsSave(false);

                onLogout();

                onNotification('Bạn không có quyền!', 'danger');

                router.push('/');

                return;
            }

            setIsSave(false);

            handleReset();

            onUpdateUser(body);
            onNotification('Cập nhập thông tin thành công', 'success');
        };

        if (isSave) {
            let body: IUserUpdateInfo = {};

            if (avatar) {
                body = { ...body, avatar };
            }

            if (fullName) {
                body = { ...body, fullName };
            }

            if (birthday) {
                body = { ...body, birthday };
            }

            if (address) {
                body = { ...body, address };
            }

            getData(controller.signal, body).catch(() => {
                setIsSave(false);

                onNotification('Máy chủ bị lỗi. Vui lòng thử lại!', 'danger');
            });
        }

        return () => controller.abort();
    }, [isSave]);

    // Handles
    const handleReset = () => {
        setAvatar(undefined);
        setAvatarTemp(undefined);
        setFullName(undefined);
        setBirthday(undefined);
        setAddress(undefined);
    };

    const handleChangeAvatar = (e: Event) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            setAvatarTemp(file);
        }
    };
    const handleChangeFullName = (e: Event) => setFullName(e.target.value);
    const handleChangeBirthday = (e: Event) =>
        setBirthday(new Date(e.target.value).getTime());
    const handleChangeAddress = (e: Event) => setAddress(e.target.value);

    const handleClickAvatar = () => inputRef.current?.click();
    const handleClickSave = () => {
        if (avatar || fullName || birthday || address) return setIsSave(true);
    };

    if (!user) return null;

    return (
        <>
            <Head>
                <title>Chỉnh sửa thông tin cá nhân</title>
            </Head>
            <main>
                <Container>
                    <Row className='justify-content-center'>
                        <Col md={8}>
                            <Card>
                                <Card.Body>
                                    <div className={Styles.box}>
                                        <div className={Styles.box_title}>
                                            Thông tin cá nhân
                                        </div>
                                        <div
                                            className={classNames(
                                                'mb-4',
                                                Styles.box_avatar
                                            )}
                                            style={{
                                                cursor: avatarTemp
                                                    ? 'not-allowed'
                                                    : 'pointer',
                                            }}
                                            onClick={handleClickAvatar}
                                        >
                                            <Image
                                                src={
                                                    avatar
                                                        ? `/temp/${avatar}`
                                                        : user.avatar
                                                        ? `/images/avatars/${user.avatar}`
                                                        : '/images/common/avatar.png'
                                                }
                                                width={80}
                                                height={80}
                                                alt='Avatar'
                                            />
                                            <input
                                                type='file'
                                                style={{ display: 'none' }}
                                                ref={inputRef}
                                                onChange={handleChangeAvatar}
                                            />
                                            <div
                                                className={
                                                    Styles.box_avatar_content
                                                }
                                            >
                                                <button
                                                    className={
                                                        Styles.box_avatar_btn
                                                    }
                                                >
                                                    <i className='material-icons-outlined'>
                                                        image
                                                    </i>
                                                    <span>Tải ảnh lên</span>
                                                </button>
                                                <p>
                                                    Chỉ JPG hoặc PNG lớn nhất là
                                                    10MB
                                                </p>
                                            </div>
                                        </div>
                                        <div
                                            className={classNames(
                                                'mb-4',
                                                Styles.box_content
                                            )}
                                        >
                                            <Form>
                                                <FloatingLabel
                                                    label='Số điện thoại'
                                                    className='mb-4'
                                                >
                                                    <Form.Control
                                                        defaultValue={formatPhoneNumber(
                                                            user.phoneNumber
                                                        )}
                                                        disabled
                                                    />
                                                </FloatingLabel>
                                                <FloatingLabel
                                                    label='Họ và tên'
                                                    className='mb-4'
                                                >
                                                    <Form.Control
                                                        value={
                                                            fullName !==
                                                            undefined
                                                                ? fullName
                                                                : user.fullName
                                                        }
                                                        onChange={
                                                            handleChangeFullName
                                                        }
                                                    />
                                                </FloatingLabel>
                                                <FloatingLabel
                                                    label='Ngày sinh'
                                                    className='mb-4'
                                                >
                                                    <Form.Control
                                                        type='date'
                                                        value={dayjs(
                                                            birthday
                                                                ? birthday
                                                                : user.birthday
                                                        ).format('YYYY-MM-DD')}
                                                        onChange={
                                                            handleChangeBirthday
                                                        }
                                                    />
                                                </FloatingLabel>
                                                <FloatingLabel
                                                    label='Địa chỉ'
                                                    className='mb-4'
                                                >
                                                    <Form.Control
                                                        value={
                                                            address !==
                                                            undefined
                                                                ? address
                                                                : user.address
                                                        }
                                                        onChange={
                                                            handleChangeAddress
                                                        }
                                                    />
                                                </FloatingLabel>
                                            </Form>
                                        </div>
                                        <div className={Styles.box_btn}>
                                            <Button
                                                variant='primary'
                                                disabled={
                                                    (!avatar &&
                                                        !fullName &&
                                                        !birthday &&
                                                        !address) ||
                                                    avatarTemp !== undefined
                                                }
                                                onClick={handleClickSave}
                                            >
                                                Lưu
                                            </Button>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </main>
        </>
    );
};

Index.getLayout = (page) => <WebLayout>{page}</WebLayout>;

export default Index;
