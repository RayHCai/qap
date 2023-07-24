import { useState } from 'react';

import CloseableModal from '@/components/ui/modals/closeableModal';
import Input from '@/components/ui/input';
import Checkbox from '@/components/ui/checkbox';

import classes from './styles.module.css';

type LoginModalProps = {
    onClose: () => void;
};

export default function LoginModal(props: LoginModalProps) {
    const [isLoggingIn, updateIsLoggingIn] = useState(true);

    if (!isLoggingIn) {
    }

    return (
        <CloseableModal
            title="Login"
            submitButtonText="Login"
            onClose={ props.onClose }
            blurBg={ true }
        >
            <div className={ classes.container }>
                { /* oAuth buttons here */ }

                <span className={ classes.seperator } />

                <form>
                    <span className={ classes.formTitle }>
                        {
                            isLoggingIn ? 'Enter your login information'
                            : 'Enter your information to sign up'
                        }
                    </span>

                    <div className={ classes.inputContainer }>
                        {
                            isLoggingIn ? (
                                <>
                                    <Input placeholder="Email" type="email" />
            
                                    <Input placeholder="Password" type="password" />
                                </>
                            ) :
                            (
                                <>
                                    <Input placeholder="Email" type="email" />
            
                                    <Input placeholder="Password" type="password" />
                                    <Input placeholder="Re-Enter Password" type="password" />
                                </>
                            )
                        }
                    </div>

                    <div className={ classes.rememberMeContainer }>
                        <label>
                            <Checkbox />
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
