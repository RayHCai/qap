import { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router';

import CloseableModal from '@/components/ui/modals/closeableModal';
import Input from '@/components/ui/input';
import Checkbox from '@/components/ui/checkbox';

import { UserContext } from '@/contexts/userContext';

import { SERVER_URL } from '@/settings';
import validateEmail from '@/helpers/validateEmail';

import classes from './styles.module.css';

type LoginModalProps = {
	onClose: () => void;
};

async function login(email: string, password: string, rememberMe: boolean) {
	const res = await fetch(`${SERVER_URL}/auth/validate/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email,
			password
		})
	});

	const data = await res.json();

	console.log(data);


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
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			username,
			email,
			password
		})
	});

	const data = await res.json();

	if (!res.ok) return;

	return data;
}

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
			submitButtonText={ isLoggingIn ? 'Login' : 'Sign Up' }
			onClose={ props.onClose }
			blurBg={ true }
			onSubmit={ submit }
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
