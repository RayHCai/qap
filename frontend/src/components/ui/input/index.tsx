import { forwardRef } from 'react';

import classes from './styles.module.css';

type InputProps = {
    className?: string;
    placeholder?: string;
    type: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(function (props, ref) {
    return (
        <input
            ref={ ref }
            className={ `${classes.input} ${props.className}` }
            placeholder={ props.placeholder }
            type={ props.type }
        />
    );
});

export default Input;
