import React, { FunctionComponent, PropsWithChildren } from 'react';

// Styles
import Styles from './styles/index.module.scss';

// Props
interface Props {
    title: string;
}

const Index: FunctionComponent<PropsWithChildren<Props>> = ({
    title,
    children,
}) => {
    return (
        <aside className={Styles.widget}>
            <h3 className={Styles.widget_title}>{title}</h3>
            <div className={Styles.widget_content}>{children}</div>
        </aside>
    );
};

export default Index;
