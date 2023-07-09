import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { BsArrowRight } from 'react-icons/bs';

import { TeacherContext } from '../../contexts/teacherContext';

import calvinLogo from '../../images/calvinLogo.svg';

import classes from './nav.module.css';

export default function Nav() {
    const { user } = useContext(TeacherContext);
    const navigate = useNavigate();

    const links = [
        {
            to: '/',
            name: 'Student Login',
        },
        {
            to: '/login',
            name: 'Teacher Login',
        }
    ];

    // TODO: Add logo

    return (
        <nav className={ classes.nav }>
            <div className={ classes.linksContainer }>
                <div className={ classes.leftContainer }>
                    <img src={ calvinLogo } alt="calvin logo" onClick={ () => navigate('/') } />
                    
                    <div className={ classes.navLinkContainer }>
                        {
                            links.map((link, i) => (
                                <NavLink key={ i } className={ classes.link } to={ link.to }>
                                    { link.name }
                                </NavLink>
                            ))
                        }
                    </div>
                </div>
                

                <div className={ classes.buttonContainer }>
                    {
                        user && (
                            <div className={ classes.profileBtnContainer }>
                                <NavLink
                                    className={ classes.profileLink }
                                    to="/dashboard"
                                >
                                    <p>Go to your account</p>
                                    <p className={ classes.iconContainer }>
                                        <BsArrowRight size={ 15 } />
                                    </p>
                                </NavLink>
                            </div>
                        )
                    }
                </div>

            </div>
        </nav>
    );
}
