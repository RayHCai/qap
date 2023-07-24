import { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { BsArrowRight } from 'react-icons/bs';

import Button from '@/components/ui/button';
import LoginModalBase from '@/components/loginModals';

import { ModalContext } from '@/contexts/modalContext';

import classes from './styles.module.css';

export default function Navbar() {
    const { addModal, removeModal } = useContext(ModalContext);
    const [loginModalId, updateLoginModalId] = useState(-1);

    const links = [
        {
            to: '/',
            name: 'Home',
        },
        {
            to: '/about',
            name: 'About',
        },
        {
            to: '/blog',
            name: 'Blog',
        },
    ];
    
    function openLoginModal() {
        updateLoginModalId(
            addModal(
                <LoginModalBase
                    onClose={ onLoginModalClose }
                />
            )
        ); 
    }

    function onLoginModalClose() {
        removeModal(loginModalId);
    }

    return (
        <nav className={ classes.nav }>
            <div className={ classes.linkContainer }>
                {
                    links.map(
                        (link, index) =>
                            (
                                <NavLink
                                    key={ index }
                                    to={ link.to }
                                    className={
                                        (linkData) => (
                                            `
                                            ${ classes.navLink }
                                            ${ linkData.isActive && classes.activeNavLink }
                                            `
                                        )
                                    }
                                >
                                    { link.name }
                                </NavLink>
                            )
                    )
                }
            </div>

            <Button onClick={ openLoginModal } className={ classes.loginButton }>
                Login <BsArrowRight className={ classes.arrow } />
            </Button>
        </nav>
    );
}
