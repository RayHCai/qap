import { type PropsWithChildren } from 'react';
import { Link, NavLink } from 'react-router-dom';

import classes from './styles.module.css';

type UnderlinedLinkProps = PropsWithChildren & {
    to: string;
    className?: string;
    isNavLink?: string;
    onClick?: () => void;
};

/*
 * Link component with underline animation on hover
 * @param {string} to - Link to go to
 * @param {string} className - Additional class name
 * @param {boolean} isNavLink - If true, use NavLink instead of Link
 * @param {function} onClick - On click callback function
 */
export default function UnderlinedLink(props: UnderlinedLinkProps) {
    if (props.isNavLink)
        return (
            <NavLink
                className={ (navData) =>
                    `${classes.link} ${props.className} ${
                        navData.isActive ? classes.active : ''
                    }`
                }
                to={ props.to }
                onClick={ props.onClick }
            >
                { props.children }
            </NavLink>
        );

    return (
        <Link
            className={ `${classes.link} ${props.className}` }
            to={ props.to }
            onClick={ props.onClick }
        >
            { props.children }
        </Link>
    );
}
