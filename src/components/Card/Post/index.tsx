/* eslint-disable indent */
import React, { FunctionComponent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

// Styles
import Styles from '../styles/index.module.scss';

// Helpers
import {
    getName,
    formatPricePerSquareMeter,
    getRelativeTime,
} from '@client/helpers';

// Interfaces
import type { IPostCompactForWebDashboard } from '@interfaces';

// Props
type Props = IPostCompactForWebDashboard;

const Index: FunctionComponent<Props> = (props) => (
    <Link href={props.link}>
        <div className={Styles.wrap}>
            <div className={Styles.img}>
                <Image
                    src={`/images/posts/${props.thumbnail}`}
                    alt={props.title}
                    fill
                />
                {props.type === 'sell' && (
                    <div className={Styles.price}>
                        {props.prices >= 1000
                            ? props.prices / 1000
                            : props.prices}{' '}
                        <span>{props.prices >= 1000 ? 'Tỷ' : 'Triệu'}</span>
                    </div>
                )}
                <div className={Styles.unit}>
                    <span className={Styles.unit_title}>
                        {props.type === 'sell' ? 'Đơn giá' : 'Mức giá'}
                    </span>
                    <p className={Styles.unit_price}>
                        {props.type === 'sell'
                            ? `${formatPricePerSquareMeter(
                                  props.acreages,
                                  props.prices
                              )}`
                            : `${props.prices} Triệu/Tháng`}
                    </p>
                </div>
            </div>
            <div className={Styles.category}>
                {getName.post.category(props.category)}
            </div>
            <div className={Styles.content}>
                <h3 className={Styles.title}>{props.title}</h3>
                <div className={Styles.info}>
                    <Row className='justify-content-center'>
                        <Col
                            md={
                                props.direction && props.facades && props.ways
                                    ? 3
                                    : (props.direction && props.facades) ||
                                      (props.direction && props.ways) ||
                                      (props.facades && props.facades)
                                    ? 4
                                    : 6
                            }
                            className={Styles.info_divider}
                        >
                            <p className={Styles.info_name}>Diện tích</p>
                            <p
                                className={Styles.info_value}
                            >{`${props.acreages} m²`}</p>
                        </Col>
                        {props.direction && (
                            <Col
                                md={
                                    props.direction &&
                                    props.facades &&
                                    props.ways
                                        ? 3
                                        : (props.direction && props.facades) ||
                                          (props.direction && props.ways) ||
                                          (props.facades && props.facades)
                                        ? 4
                                        : 6
                                }
                                className={Styles.info_divider}
                            >
                                <p className={Styles.info_name}>Hướng</p>
                                <p className={Styles.info_value}>
                                    {getName.post.direction(props.direction)}
                                </p>
                            </Col>
                        )}
                        {props.facades && (
                            <Col
                                md={
                                    props.direction &&
                                    props.facades &&
                                    props.ways
                                        ? 3
                                        : (props.direction && props.facades) ||
                                          (props.direction && props.ways) ||
                                          (props.facades && props.facades)
                                        ? 4
                                        : 6
                                }
                                className={Styles.info_divider}
                            >
                                <p className={Styles.info_name}>Mặt tiền</p>
                                <p
                                    className={Styles.info_value}
                                >{`${props.facades}m`}</p>
                            </Col>
                        )}
                        {props.ways && (
                            <Col
                                md={
                                    props.direction &&
                                    props.facades &&
                                    props.ways
                                        ? 3
                                        : (props.direction && props.facades) ||
                                          (props.direction && props.ways) ||
                                          (props.facades && props.facades)
                                        ? 4
                                        : 6
                                }
                                className={Styles.info_divider}
                            >
                                <p className={Styles.info_name}>Đường vào</p>
                                <p
                                    className={Styles.info_value}
                                >{`${props.ways}m`}</p>
                            </Col>
                        )}
                    </Row>
                </div>
                <div className={Styles.footer}>
                    <div>
                        <i className='material-icons'>fmd_good</i>
                        <span>{props.address}</span>
                    </div>
                    <span>{getRelativeTime(props.time)}</span>
                </div>
            </div>
        </div>
    </Link>
);

export default Index;
