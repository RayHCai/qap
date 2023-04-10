import { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { BsArrowRight } from 'react-icons/bs';

import { TeacherContext } from '../../contexts/teacherContext';

import classes from './nav.module.css';

export default function Nav() {
    const { user } = useContext(TeacherContext);

    const links = [
        {
            to: '/',
            name: 'Student Login'
        },
        {
            to: '/login',
            name: 'Teacher Login'
        },
    ];

    // TODO: Add logo

    return (
        <nav className={ classes.nav }>
            <div className={ classes.linksContainer }>
                {
                    links.map(
                        (link, i) => <NavLink key={ i } className={ classes.link } to={ link.to } >{ link.name }</NavLink>
                    )
                }

                {
                    user && (
                        <div className={ classes.profileBtnContainer }>
                            <NavLink className={ classes.profileLink } to="/dashboard" >
                                <p>Go to your account</p>
                                <p className={ classes.iconContainer }>
                                    <BsArrowRight size={ 15 } />
                                </p>
                            </NavLink>
                        </div>
                    )
                }

            </div>
        </nav>
    );
}
