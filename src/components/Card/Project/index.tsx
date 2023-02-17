import React, { FunctionComponent } from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'next/image';

// Styles
import Styles from '../styles/index.module.scss';

// Helpers
import { getName } from '@client/helpers';

// Interfaces
import type { IProjectCompactForWebDashboard } from '@interfaces';

// Props
type Props = IProjectCompactForWebDashboard;

const Index: FunctionComponent<Props> = (props) => (
    <Link href={props.link}>
        <div className={Styles.wrap}>
            <div className={classNames('imageHover', Styles.img)}>
                <Image
                    src={`/images/projects/${props.thumbnail}`}
                    alt={props.title}
                    fill
                />
                <div className={Styles.label}>
                    <span>{getName.project.status(props.status)}</span>
                </div>
                <h3 className={Styles.price}>{decodeURI(props.title)}</h3>
            </div>
            <p className={Styles.category}>{getName.project.t(props.type)}</p>
            <div className={Styles.content}>
                <div className={Styles.info}>
                    <Row>
                        <Col sm={8}>
                            <p className={Styles.info_name}>Chủ đầu tư</p>
                            <span className={Styles.info_value}>
                                {props.investor
                                    ? props.investor
                                    : 'Đang cập nhập'}
                            </span>
                        </Col>
                        <Col sm={4}>
                            <p className={Styles.info_name}>Quy mô</p>
                            <span className={Styles.info_value}>
                                {props.acreages}
                            </span>
                        </Col>
                    </Row>
                </div>
                <div className={Styles.footer}>
                    <div
                        className={classNames({
                            [Styles.footer_full]: props.prices === null,
                        })}
                    >
                        <i className='material-icons'>fmd_good</i>
                        <span>{props.address}</span>
                    </div>
                    {props.prices && (
                        <span>{`${
                            typeof props.prices === 'number'
                                ? props.prices
                                : `${props.prices.min} - ${props.prices.max}`
                        } triệu/m²`}</span>
                    )}
                </div>
            </div>
        </div>
    </Link>
);

export default Index;
