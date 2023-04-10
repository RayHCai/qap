import { createRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

import Loading from '../../components/loading/loading';

import { TeacherContext } from '../../contexts/teacherContext';
import { ErrorContext } from '../../contexts/errorContext';

import validateEmail from '../../helpers/validateEmail';

import { SERVER_URL } from '../../settings';

import classes from './loginOrSignup.module.css';

export default function LoginOrSignup(props: { isLogin: boolean }) {
    const navigate = useNavigate();
    
    const { updateUser } = useContext(TeacherContext);
    const { throwError } = useContext(ErrorContext);

    const username = createRef<HTMLInputElement>();
    const email = createRef<HTMLInputElement>();
    const password = createRef<HTMLInputElement>();
    const passwordRetype = createRef<HTMLInputElement>();

    const [isLoading, updateLoading] = useState(false);

    async function login() {
        const e = email.current!.value;
        const p = password.current!.value;

        if(!validateEmail(e)) return throwError('Please enter a valid email address');
        
        updateLoading(true);

        const res = await fetch(`${ SERVER_URL }/users/validate/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    email: e,
                    password: p
                }
            )
        });
        const json = await res.json();

        updateLoading(false);

        if(!res.ok) return throwError(json.message);

        updateUser(json.data);
        navigate('/dashboard'); 
    }

    async function signup() {
        const u = username.current!.value;
        const e = email.current!.value;
        const p = password.current!.value;
        const retyped = passwordRetype.current!.value;

        if(u.replaceAll(' ', '').length !== u.length) return throwError('Username cannot contains spaces');
        else if(u.length > 255) return throwError('Username cannot be more than 255 characters long');
        else if(u.length === 0) return throwError('Username cannot be empty');

        else if(!validateEmail(e)) return throwError('Please enter a valid email address');

        else if(p.replaceAll(' ', '').length !== p.length) return throwError('Password cannot contain spaces');
        else if(p.length === 0) return throwError('Password cannot be empty');
        else if(p !== retyped) return throwError('Passwords do not match');

        updateLoading(true);

        const res = await fetch(`${ SERVER_URL }/users/manage/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    username: u,
                    email: e,
                    password: p
                }
            )
        });
        const json = await res.json();

        updateLoading(false);

        if(!res.ok) return throwError(json.message);
        
        updateUser(json.data);
        navigate('/dashboard'); 
    }

    if(isLoading) return <Loading />;

    // TODO: Add oAuth login with google and github

    return (
        <div>
            <div className={ classes.contentContainer }>
                <div className={ classes.containersContainer }>
                    {
                        props.isLogin ? (
                            <div className={ classes.container }>
                                <h1>Login</h1>

                                <input
                                    ref={ email }
                                    placeholder="Email address"
                                    type="email"
                                />

                                <input
                                    ref={ password }
                                    placeholder="Password"
                                    type="password"
                                />

                                <button onClick={ login }>Login</button>

                                <div className={ classes.linkContainer }>
                                    Don't have an account? Sign up <Link to="/signup">here.</Link>
                                </div>
                            </div>
                        ) : (
                            <div className={ classes.container }>
                                <h1>Signup</h1>

                                <input
                                    ref={ username }
                                    placeholder="Username"
                                    type="text"
                                />

                                <input
                                    ref={ email }
                                    placeholder="Email address"
                                    type="email"
                                />

                                <input
                                    ref={ password }
                                    placeholder="Password"
                                    type="password"
                                />

                                <input
                                    ref={ passwordRetype }
                                    placeholder="Re-enter your password"
                                    type="password"
                                />

                                <button onClick={ signup }>Signup</button>

                                <div className={ classes.linkContainer }>
                                    Already have an account? Login <Link to="/login">here.</Link>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}
