import React, {
    FunctionComponent,
    useContext,
    useState,
    useEffect,
} from 'react';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Image as ImageBootstrap } from 'react-bootstrap';

// Styles
import Styles from './style/index.module.scss';

// Components
import { LoginComponent } from '@client/components';

// Context
import { Context } from '@client/context/Web';

const Index: FunctionComponent = () => {
    // States
    const [isMenu, setIsMenu] = useState<boolean>(false);
    const [isUser, setIsUser] = useState<boolean>(false);
    const [isLogin, setIsLogin] = useState<boolean>(false);

    // Hooks
    const router = useRouter();
    const { user, onLogout } = useContext(Context);

    // Effects
    useEffect(() => {
        const handleChange = () => {
            setIsMenu(false);
            setIsUser(false);
        };

        router.events.on('routeChangeStart', handleChange);

        return () => router.events.off('routeChangeStart', handleChange);
    }, [router]);

    // Handles
    const handleToggleMenu = () => setIsMenu((preIsMenu) => !preIsMenu);
    const handleToggleUser = () => setIsUser((preIsUser) => !preIsUser);
    const handleCloseLogin = () => setIsLogin(false);

    const handleClickBg = () => {
        if (isMenu) {
            setIsMenu(false);
        }

        if (isUser) {
            setIsUser(false);
        }
    };
    const handleClickLogin = () => setIsLogin(true);
    const handleClickLogout = () => {
        if (isMenu) {
            setIsMenu(false);
        }

        if (isUser) {
            setIsUser(false);
        }

        onLogout();
    };

    return (
        <>
            <div
                className={classNames({ [Styles.bg]: isUser || isMenu })}
                onClick={handleClickBg}
            />
            <header className={Styles.header}>
                <div className={Styles.content}>
                    <div
                        className={classNames(Styles.block, Styles.block_left)}
                    >
                        <h1>
                            <Link
                                href='/'
                                className={classNames(
                                    Styles.menu_item,
                                    Styles.logo
                                )}
                            >
                                <>
                                    <Image
                                        src='/images/common/logo-light.png'
                                        width={140}
                                        height={30}
                                        alt='banbds.vn'
                                    />
                                </>
                            </Link>
                        </h1>
                        <a
                            href='/ban-bat-dong-san'
                            className={classNames(
                                Styles.menu_item,
                                Styles.menu_item_bg
                            )}
                        >
                            Mua bán
                        </a>
                        <a
                            href='/cho-thue-bat-dong-san'
                            className={classNames(
                                Styles.menu_item,
                                Styles.menu_item_bg
                            )}
                        >
                            Cho thuê
                        </a>
                        <a
                            href='/du-an-bat-dong-san'
                            className={classNames(
                                Styles.menu_item,
                                Styles.menu_item_bg
                            )}
                        >
                            Dự án
                        </a>
                        <Link
                            href='/tin-tuc'
                            className={classNames(
                                Styles.menu_item,
                                Styles.menu_item_bg
                            )}
                        >
                            Tin tức
                        </Link>
                    </div>
                    <div
                        className={classNames(Styles.block, Styles.block_right)}
                    >
                        {user && (
                            <div
                                className={Styles.menu_box}
                                style={{ border: 'none' }}
                            >
                                <div
                                    className={Styles.menu_avatar}
                                    onClick={handleToggleUser}
                                >
                                    <ImageBootstrap
                                        src={
                                            user.avatar
                                                ? `/images/avatars/${user.avatar}`
                                                : '/images/common/avatar.png'
                                        }
                                        width={20}
                                        height={20}
                                        roundedCircle
                                    />
                                    <span className='mx-2'>
                                        {
                                            user.fullName.split(' ')[
                                                user.fullName.split(' ')
                                                    .length - 1
                                            ]
                                        }
                                    </span>
                                    <i className='material-icons'>
                                        expand_more
                                    </i>
                                </div>
                                <div
                                    className={classNames(Styles.avatar, {
                                        [Styles.avatar_active]: isUser,
                                    })}
                                >
                                    <div className='d-flex align-items-center w-100'>
                                        <div
                                            className={classNames(
                                                Styles.avatar_param,
                                                Styles.avatar_left
                                            )}
                                        >
                                            <div
                                                className={
                                                    Styles.avatar_param_title
                                                }
                                            >
                                                <i className='material-icons-outlined'>
                                                    home_work
                                                </i>
                                                <p>Tin đã đăng</p>
                                            </div>
                                            <h3
                                                className={
                                                    Styles.avatar_param_value
                                                }
                                            >
                                                {`${user.posts.accept} tin`}
                                            </h3>
                                        </div>
                                        <div
                                            className={classNames(
                                                Styles.avatar_param,
                                                Styles.avatar_right
                                            )}
                                        >
                                            <div
                                                className={
                                                    Styles.avatar_param_title
                                                }
                                            >
                                                <i className='material-icons-outlined'>
                                                    add_home_work
                                                </i>
                                                <p>Tin chờ duyệt</p>
                                            </div>
                                            <h3
                                                className={
                                                    Styles.avatar_param_value
                                                }
                                            >
                                                {`${user.posts.pending} tin`}
                                            </h3>
                                        </div>
                                    </div>
                                    <Link
                                        href='/thong-tin-ca-nhan'
                                        className={classNames(
                                            'w-100',
                                            Styles.avatar_item
                                        )}
                                    >
                                        <>
                                            <i className='material-icons-outlined'>
                                                account_circle
                                            </i>
                                            <span>Thông tin cá nhân</span>
                                        </>
                                    </Link>
                                    <Link
                                        href='/quan-ly-tin-dang'
                                        className={classNames(
                                            'w-100',
                                            Styles.avatar_item
                                        )}
                                    >
                                        <>
                                            <i className='material-icons-outlined'>
                                                business_center
                                            </i>
                                            <span>Quản lý tin đăng</span>
                                        </>
                                    </Link>
                                    <hr
                                        style={{
                                            margin: 0,
                                            color: 'var(--bs-gray)',
                                        }}
                                    />
                                    <Button
                                        className={Styles.avatar_logout}
                                        variant='outline_danger'
                                        onClick={handleClickLogout}
                                    >
                                        Đăng xuất
                                    </Button>
                                </div>
                            </div>
                        )}
                        <div
                            className={classNames(Styles.menu, {
                                [Styles.active]: isMenu,
                            })}
                        >
                            <Link
                                href='https://drive.google.com/file/d/1evUoFIuEKhvnVpIcbBqpV-9BEEJk7NVe/view?usp=sharing'
                                className={Styles.menu_item}
                            >
                                <>
                                    <i className='material-icons'>download</i>{' '}
                                    Tải APP
                                </>
                            </Link>
                            {!user && (
                                <button
                                    className={Styles.menu_item}
                                    onClick={handleClickLogin}
                                >
                                    Đăng nhập
                                </button>
                            )}
                            <div className={Styles.menu_box}>
                                <Link
                                    href='/dang-tin'
                                    className={Styles.menu_item}
                                >
                                    <>
                                        <i className='material-icons'>
                                            account_box
                                        </i>{' '}
                                        Đăng tin BĐS
                                    </>
                                </Link>
                            </div>
                        </div>
                        <Button
                            className={Styles.menu_mobile}
                            onClick={handleToggleMenu}
                        >
                            <i className='material-icons-outlined'>menu</i>
                        </Button>
                    </div>
                </div>
            </header>
            {isLogin && <LoginComponent.Web onClose={handleCloseLogin} />}
        </>
    );
};

export default Index;
