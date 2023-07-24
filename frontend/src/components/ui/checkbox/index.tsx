import { forwardRef } from 'react';

import classes from './styles.module.css';

type InputProps = {
    className?: string;
}

const Checkbox = forwardRef<HTMLInputElement, InputProps>(
    function (props, ref) {
        return (
            <input
                ref={ ref }
                className={ `${ classes.input } ${ props.className }` }
                type="checkbox"
            />
        );
    }
);

export default Checkbox;
