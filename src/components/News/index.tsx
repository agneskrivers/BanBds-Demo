import React, { FunctionComponent } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import Image from 'next/image';

// Styles
import Styles from './styles/index.module.scss';

// Helpers
import { getRelativeTime } from '@client/helpers';

// Interfaces
import type {
    INewsCompactForWeb,
    INewsCompactModeSmallForWeb,
    INewsCompactModeTitleForWeb,
} from '@interfaces';

// Interface
interface PropsModeNormal {
    mode: 'normal';
    data: INewsCompactForWeb;
}
interface PropsModeSmall {
    mode: 'small';
    data: INewsCompactModeSmallForWeb;
    height?: number;
}
interface PropsModeTitle {
    mode: 'title';
    data: INewsCompactModeTitleForWeb;
}

// Props
type Props = PropsModeNormal | PropsModeSmall | PropsModeTitle;

const Index: FunctionComponent<Props> = (props) => (
    <Link href={props.data.link}>
        <article
            className={classNames(Styles.article, {
                [Styles.article_compact]: props.mode !== 'normal',
                [Styles.article_small]: props.mode === 'small',
                [Styles.article_notThumbnail]: props.mode === 'title',
            })}
        >
            {props.mode !== 'title' && (
                <div
                    className={Styles.article_thumbnail}
                    style={{
                        height:
                            props.mode === 'small'
                                ? props.height
                                    ? props.height
                                    : 200
                                : 180,
                    }}
                >
                    <Image
                        src={`/images/news/${props.data.thumbnail}`}
                        alt={decodeURI(props.data.title)}
                        fill
                    />
                </div>
            )}
            <header>
                <p className={Styles.article_title}>
                    {decodeURI(props.data.title)}
                </p>
                {props.mode === 'normal' && (
                    <p className={Styles.article_description}>
                        {decodeURI(props.data.description)}
                    </p>
                )}
                {props.mode !== 'title' && (
                    <p className={Styles.article_time}>
                        {getRelativeTime(props.data.time)}
                    </p>
                )}
            </header>
        </article>
    </Link>
);

export default Index;
