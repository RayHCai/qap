import { useState } from 'react';

import CloseableModal from '@/components/ui/modals/closeableModal';
import Input from '@/components/ui/input';
import Checkbox from '@/components/ui/checkbox';

import classes from './styles.module.css';

type LoginModalProps = {
    onClose: () => void;
}

export default function LoginModal(props: LoginModalProps) {
    const [isLoggingIn, updateIsLoggingIn] = useState(true);
    
    if(!isLoggingIn) {

    }

    return (
        <CloseableModal
            title="Login"
            submitButtonText="Login"
            onClose={ props.onClose }
            blurBg={ true }
        >
            <div className={ classes.container }>
                {/* oAuth buttons here */}
                
                <span className={ classes.seperator } />

                <form>
                    <span className={ classes.formTitle }>Enter your login information</span>
                    
                    <div className={ classes.inputContainer }>
                        <Input
                            placeholder="Email"
                            type="email"
                        />
                        
                        <Input
                            placeholder="Password"
                            type="password"
                        />
                    </div>

                    <div className={ classes.rememberMeContainer }>
                        <label>
                            <Checkbox />
                            <span>Remember Me</span>
                        </label>
                    </div>
                </form>
            </div>
        </CloseableModal>
    );
}
