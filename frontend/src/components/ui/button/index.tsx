import { PropsWithChildren } from 'react';
import classes from './styles.module.css';

export default function Button({
    onClick,
    children,
    parameters,
    className,
}: { onClick: (args?: any) => void; parameters?: any; className?: string } & PropsWithChildren) {
    return (
        <button className={ classes.button + ' ' + className } onClick={ () => onClick(parameters) }>
            { children }
        </button>
    );
}
