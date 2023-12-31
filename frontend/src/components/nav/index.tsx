import { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { RxHamburgerMenu } from 'react-icons/rx';
import { GrClose } from 'react-icons/gr';

import Button from '@/components/ui/button';
import Logo from '@/components/ui/logo';
import { UserContext } from '@/contexts/userContext';

import useLogout from '@/hooks/useLogout';

import classes from './styles.module.css';

export default function Navbar() {
    const { user } = useContext(UserContext);
    const logout = useLogout();

    const [sideNavOpen, setSideNavOpen] = useState(false);

    const loggedInLinks = [
        {
            to: '/dashboard',
            text: 'Dashboard',
        },
        {
            to: '/library',
            text: 'Library',
        },
        {
            to: '/rooms',
            text: 'Rooms',
        },
        {
            to: '/live',
            text: 'Live Results',
        },
    ];

    return (
        <nav className={ classes.nav }>
            <Logo />

            { user &&
                (sideNavOpen ? (
                    <div className={ classes.sideNav }>
                        <div className={ classes.closeButtonContainer }>
                            <GrClose
                                onClick={ () => setSideNavOpen(false) }
                                className={ classes.closeIcon }
                            />
                        </div>

                        <div className={ classes.linkContainer }>
                            { loggedInLinks.map(({ to, text }) => (
                                <NavLink
                                    key={ to }
                                    to={ to }
                                    onClick={ () => setSideNavOpen(false) }
                                    className={ (navData) =>
                                        `
                                                                ${classes.link}
                                                                ${
                                                                    navData.isActive
                                                                        ? classes.active
                                                                        : ''
                                                                }
                                                            `
                                    }
                                >
                                    { text }
                                </NavLink>
                            )) }
                        </div>

                        <Button
                            onClick={ () => {
                                setSideNavOpen(false);
                                logout();
                            } }
                            className={ classes.logoutButton }
                        >
                            Logout
                        </Button>
                    </div>
                ) : (
                    <div className={ classes.hamburgerContainer }>
                        <RxHamburgerMenu
                            onClick={ () => setSideNavOpen(true) }
                            className={ classes.icon }
                        />
                    </div>
                )) }
        </nav>
    );
}
