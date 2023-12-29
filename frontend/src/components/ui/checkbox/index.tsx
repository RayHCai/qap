import { forwardRef } from 'react';

import classes from './styles.module.css';

type CheckboxProps = {
    className?: string;
};

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function (
    props,
    ref
) {
    return (
        <input
            ref={ ref }
            className={ `${classes.input} ${props.className}` }
            type="checkbox"
        />
    );
});

export default Checkbox;
