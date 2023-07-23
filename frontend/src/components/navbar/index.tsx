import { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { BsArrowRight } from 'react-icons/bs';

import Button from '@/components/ui/button';
import LoginModal from '@/components/loginModal';

import { ModalContext } from '@/contexts/modalContext';

import classes from './styles.module.css';

export default function Navbar() {
    const { addModal } = useContext(ModalContext);

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
    
    function login() {
        addModal(<LoginModal />); 
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

            <Button onClick={ login } className={ classes.loginButton }>
                Login <BsArrowRight className={ classes.arrow } />
            </Button>
        </nav>
    );
}
