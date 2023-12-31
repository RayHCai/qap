import { forwardRef } from 'react';

import classes from './styles.module.css';

type CheckboxProps = {
    className?: string;
    checked?: boolean;
    onClick?: () => void;
};

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function (
    props,
    ref
) {
    return (
        <input
            ref={ ref }
            type="checkbox"
            className={ `${classes.input} ${props.className}` }
            defaultChecked={ props.checked }
            onClick={ props.onClick }
        />
    );
});

export default Checkbox;
