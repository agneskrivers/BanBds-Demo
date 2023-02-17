import React, { FunctionComponent } from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

// Styles
import Styles from './styles/index.module.scss';

const Index: FunctionComponent = () => {
    return (
        <>
            <footer className={Styles.footer}>
                <Container>
                    <Row className='justify-content-between'>
                        <Col
                            lg={4}
                            className='d-flex justify-content-center align-items-center'
                        >
                            <Link href='/'>
                                <Image
                                    src='/images/common/logo-dark.png'
                                    height={60}
                                />
                            </Link>
                        </Col>
                        <Col lg={7}>
                            <Row className='d-flex mt-4 mt-lg-0 align-items-center h-100'>
                                <Col xs={6}>
                                    <div className={Styles.footer_support}>
                                        <i className='material-icons-outlined'>
                                            phone_in_talk
                                        </i>
                                        <div
                                            className={
                                                Styles.footer_support_content
                                            }
                                        >
                                            <span>Hotline</span>
                                            <p>1900 1881</p>
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={6}>
                                    <div className={Styles.footer_support}>
                                        <i className='material-icons-outlined'>
                                            headphones
                                        </i>
                                        <div
                                            className={
                                                Styles.footer_support_content
                                            }
                                        >
                                            <span>Chăm sóc khách hàng</span>
                                            <p>hotro@banbds.vn</p>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className='justify-content-between'>
                        <Col lg={4}>
                            <div className={Styles.footer_bottom}>
                                <div className={Styles.footer_address}>
                                    <i className='material-icons-outlined'>
                                        location_on
                                    </i>
                                    <span>
                                        Tầng 31, Keangnam Hanoi Landmark, Phạm
                                        Hùng, Nam Từ Liêm, Hà Nội
                                    </span>
                                </div>
                                <div className={Styles.footer_address}>
                                    <i className='material-icons-outlined'>
                                        phone_in_talk
                                    </i>
                                    <span>
                                        (024) 3562 5939 - (024) 3562 5940
                                    </span>
                                </div>
                            </div>
                        </Col>
                        <Col lg={7}>
                            <Row
                                className={classNames(
                                    'justify-content-between',
                                    Styles.footer_bottom
                                )}
                            >
                                <Col lg={4}>
                                    <div className={Styles.footer_list}>
                                        <p className={Styles.footer_list_title}>
                                            QUY ĐỊNH
                                        </p>
                                        <ul>
                                            <li>
                                                <Link href='/dieu-khoan-thoa-thuan'>
                                                    Điều khoản thỏa thuận
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href='/chinh-sach-bao-mat'>
                                                    Chính sách bảo mật
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href='/giai-quyet-khieu-nai'>
                                                    Giải quyết khiếu nại
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </Col>
                                <Col
                                    lg={8}
                                    className='d-flex justify-content-around align-items-center'
                                >
                                    <a href='https://play.google.com/store/games'>
                                        <Image
                                            src='/images/common/google-play.png'
                                            height={30}
                                        />
                                    </a>
                                    <a href='https://apps.apple.com/us/app/apple-store/id375380948'>
                                        <Image
                                            src='/images/common/app-store.png'
                                            height={30}
                                        />
                                    </a>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </>
    );
};

export default React.memo(Index);
