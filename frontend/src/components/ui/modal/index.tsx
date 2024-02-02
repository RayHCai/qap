import { type PropsWithChildren } from 'react';

import classes from './styles.module.css';

export type BaseModalProps = {
    blurBg?: boolean;
    darkenBg?: boolean;
};

export default function ModalBase(props: BaseModalProps & PropsWithChildren) {
    return (
        <div
            className={ `
                ${classes.overlay}
                ${props.blurBg && classes.blurBg}
                ${props.darkenBg && classes.darkenBg}
                ` }
        >
            <div className={ classes.container }>{ props.children }</div>
        </div>
    );
}
