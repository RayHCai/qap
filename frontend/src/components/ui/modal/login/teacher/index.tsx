import { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router';

import Input from '@/components/ui/textbox';
import Checkbox from '@/components/ui/checkbox';
import CloseableModal from '@/components/ui/modal/closeable';

import { UserContext } from '@/contexts/userContext';

import { SERVER_URL } from '@/settings';
import validateEmail from '@/helpers/validateEmail';

import classes from './styles.module.css';

async function login(email: string, password: string, rememberMe: boolean) {
    const res = await fetch(`${SERVER_URL}/auth/validate/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    const data = await res.json();

    if (!res.ok) return;

    return data;
}

async function signUp(
    username: string,
    email: string,
    password: string,
    rememberMe: boolean
) {
    const res = await fetch(`${SERVER_URL}/auth/signup/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            email,
            password,
        }),
    });

    const data = await res.json();

    if (!res.ok) return;

    return data;
}

type LoginModalProps = {
    onClose: () => void;
};

export default function LoginModal(props: LoginModalProps) {
    const navigate = useNavigate();

    const [isLoggingIn, updateIsLoggingIn] = useState(true);

    const usernameInput = useRef<HTMLInputElement>(null);
    const emailInput = useRef<HTMLInputElement>(null);
    const rememberMeInput = useRef<HTMLInputElement>(null);

    const passwordInput = useRef<HTMLInputElement>(null);
    const rePasswordInput = useRef<HTMLInputElement>(null);

    const { setUser } = useContext(UserContext);

    async function submit() {
        const email = emailInput.current!.value;
        const password = passwordInput.current!.value;
        const rememberMe = rememberMeInput.current!.checked;

        if (!email || !validateEmail(email) || !password) return;

        if (isLoggingIn) setUser(await login(email, password, rememberMe));
        else {
            const rePassword = rePasswordInput.current!.value;
            const username = usernameInput.current!.value;

            if (rePassword !== password) return;

            setUser(await signUp(username, email, password, rememberMe));
        }

        navigate('/dashboard');
        props.onClose();
    }

    return (
        <CloseableModal
            title={ isLoggingIn ? 'Login' : 'Sign Up' }
            blurBg={ true }
            onClose={ props.onClose }
            onSubmit={ submit }
            submitButtonText={ isLoggingIn ? 'Login' : 'Sign Up' }
        >
            <div className={ classes.container }>
                { /* oAuth buttons here */ }

                <span className={ classes.seperator } />

                <form>
                    <span className={ classes.formTitle }>
                        { isLoggingIn
                            ? 'Enter your login information'
                            : 'Enter your information to sign up' }
                    </span>

                    <div className={ classes.inputContainer }>
                        { !isLoggingIn && (
                            <Input
                                type="text"
                                ref={ usernameInput }
                                placeholder="Username"
                            />
                        ) }

                        <Input
                            ref={ emailInput }
                            placeholder="Email"
                            type="email"
                        />

                        <Input
                            ref={ passwordInput }
                            placeholder="Password"
                            type="password"
                        />

                        { !isLoggingIn && (
                            <Input
                                ref={ rePasswordInput }
                                placeholder="Re-Enter Password"
                                type="password"
                            />
                        ) }
                    </div>

                    <div className={ classes.rememberMeContainer }>
                        <label>
                            <Checkbox ref={ rememberMeInput } />
                            <span>Remember Me</span>
                        </label>
                    </div>

                    <div className={ classes.switchType }>
                        { isLoggingIn ? (
                            <span>
                                Don't have an account?{ ' ' }
                                <span
                                    onClick={ () => updateIsLoggingIn(false) }
                                    className={ classes.switchTypeLink }
                                >
                                    Sign Up
                                </span>{ ' ' }
                                instead
                            </span>
                        ) : (
                            <span>
                                Already have an account?{ ' ' }
                                <span
                                    onClick={ () => updateIsLoggingIn(true) }
                                    className={ classes.switchTypeLink }
                                >
                                    Login
                                </span>{ ' ' }
                                instead
                            </span>
                        ) }
                    </div>
                </form>
            </div>
        </CloseableModal>
    );
}
