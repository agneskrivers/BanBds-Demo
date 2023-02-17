import React, { FunctionComponent } from 'react';
import { Row, Col } from 'react-bootstrap';
import classNames from 'classnames';
import Link from 'next/link';
import Image from 'next/image';

// Styles
import Styles from './styles/index.module.scss';

// Helpers
import { getName } from '@client/helpers';

// Interfaces
import type { IProjectCompactForWeb } from '@interfaces';

// Props
type Props = IProjectCompactForWeb;

const Index: FunctionComponent<Props> = (props) => (
    <Link href={props.link}>
        <div className={Styles.project}>
            <Row>
                <Col md={4}>
                    <div className={Styles.project_img}>
                        <Image
                            src={`/images/projects/${props.thumbnail}`}
                            alt={`Image ${decodeURI(props.title)}`}
                            fill
                        />
                        <div className={Styles.project_total}>
                            <i className='material-icons-outlined'>image</i>
                            <span>{props.images}</span>
                        </div>
                        <p
                            className={classNames(Styles.project_status, {
                                [Styles.handedOver]:
                                    props.status === 'handedOver',
                                [Styles.onSale]: props.status === 'onSale',
                                [Styles.openingSoon]:
                                    props.status === 'openingSoon',
                            })}
                        >
                            {getName.project.status(props.status)}
                        </p>
                    </div>
                </Col>
                <Col md={8}>
                    <div className={Styles.project_content}>
                        <div>
                            <h3 className={Styles.project_title}>
                                {decodeURI(props.title)}
                            </h3>
                            <div className={Styles.project_info}>
                                {props.prices && (
                                    <p>{`${
                                        typeof props.prices === 'number'
                                            ? props.prices.toLocaleString('en')
                                            : `${props.prices.min} - ${props.prices.max}`
                                    } triệu/m²`}</p>
                                )}
                                <p>{props.acreages}</p>
                                {props.numberOfApartments && (
                                    <p>
                                        {`${props.numberOfApartments} `}
                                        <i className='material-icons-outlined'>
                                            home
                                        </i>
                                    </p>
                                )}
                                {props.courtNumber && (
                                    <p>
                                        {`${props.courtNumber} `}
                                        <i className='material-icons-outlined'>
                                            apartment
                                        </i>
                                    </p>
                                )}
                            </div>
                            <p className={Styles.project_address}>
                                {props.address}
                            </p>
                        </div>
                        {props.investor && (
                            <div className={Styles.project_investor}>
                                {props.investor.avatar && (
                                    <Image
                                        src={`/images/avatars/${props.investor.avatar}`}
                                        alt={props.investor.name}
                                        width={32}
                                        height={32}
                                    />
                                )}
                                <p>{props.investor.name}</p>
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
        </div>
    </Link>
);

export default Index;
