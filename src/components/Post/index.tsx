/* eslint-disable indent */
import React, { FunctionComponent } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import { Row, Col, Image, Badge, Spinner } from 'react-bootstrap';

// Styles
import Styles from './styles/index.module.scss';

// Helpers
import { getRelativeTime, formatPricePerSquareMeter } from '@client/helpers';

// Interfaces
import type {
    IPostCompactForWeb,
    IPostCompactModeEditorForWeb,
    IPostCompactModeVerticalForWeb,
} from '@interfaces';

// Interface
interface PropsModeNormal {
    mode: 'normal';
    data: IPostCompactForWeb;
}
interface PropsModeVertical {
    mode: 'vertical';
    data: IPostCompactModeVerticalForWeb;
}
interface PropsModeEditor {
    mode: 'editor';
    data: IPostCompactModeEditorForWeb;
    postID?: number;
    onRemove(postID: number): void;
}

// Props
type Props = PropsModeNormal | PropsModeEditor | PropsModeVertical;

const Index: FunctionComponent<Props> = (props) => {
    // Props
    const { mode, data } = props;

    // Handles
    const handleClickRemove = (postID: number) => {
        if (mode === 'editor') {
            const isRemove = confirm(
                'Bạn có chắc chắn khi xóa tin đăng này không?'
            );

            if (isRemove) {
                props.onRemove(postID);
            }
        }
    };

    if (mode === 'editor') {
        return (
            <div className={classNames(Styles.product, Styles.product_editor)}>
                <Row>
                    <Col md={4}>
                        <div className={classNames(Styles.product_img)}>
                            <Image
                                src={`/images/posts/${data.thumbnail}`}
                                alt={data.title}
                            />
                            <p className={Styles.product_img_info}>
                                {data.isVideo && (
                                    <i className='material-icons-outlined'>
                                        play_circle
                                    </i>
                                )}
                                <i className='material-icons-outlined'>image</i>
                                <span>{data.images}</span>
                            </p>
                        </div>
                    </Col>
                    <Col md={8}>
                        <div className={Styles.product_content}>
                            <div>
                                <h3 className={Styles.product_title}>
                                    {data.title}
                                </h3>
                                <p className={Styles.product_address}>
                                    {data.address}
                                </p>
                                <Badge
                                    pill
                                    bg={
                                        data.type === 'rent'
                                            ? 'info'
                                            : 'primary'
                                    }
                                >
                                    {data.type === 'rent'
                                        ? 'Cho thuê'
                                        : 'Mua bán'}
                                </Badge>
                                <Badge
                                    className='ms-2'
                                    pill
                                    bg={
                                        data.status === 'accept'
                                            ? 'success'
                                            : data.status === 'pending'
                                            ? 'warning'
                                            : 'danger'
                                    }
                                >
                                    {data.status === 'accept'
                                        ? 'Đã duyệt'
                                        : data.status === 'pending'
                                        ? 'Đang chờ duyệt'
                                        : 'Đã bán'}
                                </Badge>
                            </div>
                            <div className={Styles.product_btn}>
                                {data.status !== 'sold' && (
                                    <Link
                                        href={
                                            props.postID !== undefined
                                                ? '#'
                                                : `/quan-ly-tin-dang/${data.postID}`
                                        }
                                        className={Styles.product_btn_edit}
                                    >
                                        Chỉnh sửa
                                    </Link>
                                )}
                                <button
                                    className={Styles.product_btn_remove}
                                    onClick={() =>
                                        handleClickRemove(data.postID)
                                    }
                                    disabled={props.postID !== undefined}
                                >
                                    {props.postID !== undefined &&
                                    props.postID === props.data.postID ? (
                                        <Spinner size='sm' />
                                    ) : (
                                        'Xóa'
                                    )}
                                </button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }

    return (
        <Link href={data.link}>
            <div
                className={classNames(Styles.product, {
                    [Styles.product_vertical]: mode === 'vertical',
                })}
            >
                <Row>
                    <Col md={mode === 'normal' ? 4 : 12}>
                        <div className={classNames(Styles.product_img)}>
                            <Image
                                src={`/images/posts/${data.thumbnail}`}
                                alt={data.title}
                            />
                            {mode === 'normal' && (
                                <p className={Styles.product_img_info}>
                                    {data.isVideo && (
                                        <i className='material-icons-outlined'>
                                            play_circle
                                        </i>
                                    )}
                                    <i className='material-icons-outlined'>
                                        image
                                    </i>
                                    <span>{data.images}</span>
                                </p>
                            )}
                        </div>
                    </Col>
                    <Col md={mode === 'normal' ? 8 : 12}>
                        <div className={Styles.product_content}>
                            <div>
                                <h3 className={Styles.product_title}>
                                    {data.title}
                                </h3>
                                <p className={Styles.product_address}>
                                    {data.address}
                                </p>
                                <div className={Styles.product_info}>
                                    <p>{`${data.acreages} m²`}</p>
                                    <p>{`${
                                        data.prices >= 1000
                                            ? data.prices / 1000
                                            : data.prices
                                    } ${data.prices >= 1000 ? 'tỷ' : 'triệu'}${
                                        mode === 'normal' &&
                                        data.type === 'rent'
                                            ? '/tháng'
                                            : ''
                                    }`}</p>
                                    {mode === 'normal' &&
                                        props.data.type === 'sell' && (
                                            <p>
                                                {formatPricePerSquareMeter(
                                                    data.acreages,
                                                    data.prices
                                                )}
                                            </p>
                                        )}
                                </div>
                            </div>
                            {mode === 'normal' && (
                                <p className={Styles.product_time}>
                                    {getRelativeTime(data.time)}
                                </p>
                            )}
                        </div>
                    </Col>
                </Row>
            </div>
        </Link>
    );
};

export default Index;
