import React, { FunctionComponent } from 'react';
import Image from 'next/image';
import { Spinner } from 'react-bootstrap';

// Styles
import Styles from './styles/index.module.scss';

const Index: FunctionComponent = () => (
    <div className={Styles.content}>
        <div className={Styles.img}>
            <Image src='/images/common/logo-dark.png' fill alt='BanBds' />
        </div>
        <Spinner variant='primary' />
    </div>
);

export default Index;
