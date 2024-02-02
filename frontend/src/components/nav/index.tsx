import { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { RxHamburgerMenu } from 'react-icons/rx';
import { GrClose } from 'react-icons/gr';

import Button from '@/components/ui/button';
import Logo from '@/components/ui/logo';
import UnderlinedLink from '@/components/ui/underlinedLink';

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
            to: '/launch',
            text: 'Launch',
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

            { user && (
                <div className={ classes.userNav }>
                    <div className={ classes.roomSelector }>dsadsada</div>

                    { sideNavOpen ? (
                        <div className={ classes.sideNav }>
                            <div className={ classes.closeButtonContainer }>
                                <GrClose
                                    onClick={ () => setSideNavOpen(false) }
                                    className={ classes.closeIcon }
                                />
                            </div>

                            <div className={ classes.linkContainer }>
                                { loggedInLinks.map(({ to, text }) => (
                                    <UnderlinedLink
                                        key={ to }
                                        to={ to }
                                        onClick={ () => setSideNavOpen(false) }
                                        isNavLink={ true }
                                        className={ classes.link }
                                    >
                                        { text }
                                    </UnderlinedLink>
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
                    ) }
                </div>
            ) }
        </nav>
    );
}
