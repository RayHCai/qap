import CloseableModal from '@/components/ui/modals/closeableModal';
import Input from '@/components/ui/input';

import classes from './styles.module.css';

export default function LoginModal() {
    return (
        <CloseableModal
            title="Login"
            submitButtonText="Login"
            onClose={ () => {} }
            blurBg={ true }
        >
            <div className={ classes.container }>
                {/* oAuth buttons here */}
                
                <form>
                    <label className={ classes.label }>
                        <p>Email</p>
                        <Input
                            placeholder="Email"
                            type="email"
                        />
                    </label>
                </form>
            </div>
        </CloseableModal>
    );
}
