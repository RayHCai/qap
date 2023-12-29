import { type PropsWithChildren } from 'react';

import classes from './styles.module.css';

type ButtonProps = PropsWithChildren & {
    onClick: (args?: any) => void;
    light?: boolean;
    parameters?: any;
    className?: string;
};

export default function Button(props: ButtonProps) {
    return (
        <button
            className={ `${classes.button} ${props.light ? classes.light : ''} ${
                props.className
            }` }
            onClick={ () => props.onClick(props.parameters) }
        >
            { props.children }
        </button>
    );
}
