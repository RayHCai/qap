import { forwardRef } from 'react';

import classes from './styles.module.css';

type TextboxProps = {
    className?: string;
    placeholder: string;
    type: string;
};

const Textbox = forwardRef<HTMLInputElement, TextboxProps>(function (
    props,
    ref
) {
    return (
        <input
            ref={ ref }
            className={ `${classes.input} ${props.className}` }
            placeholder={ props.placeholder }
            type={ props.type }
        />
    );
});

export default Textbox;
