import { useRef } from 'react';

import CloseableModal from '@/components/ui/modals/closeableModal';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';

import classes from './styles.module.css';

type LoginModalProps = {
    onClose: () => void;
}

export default function StudentLoginModal(props: LoginModalProps) {
    const roomNameField = useRef<HTMLInputElement>(null);
    
    async function joinRoom() {
        const roomName = roomNameField.current!.value;
    }

    return (
        <CloseableModal
            title="Student Login"
            submitButtonText="Login"
            onClose={ props.onClose }
            blurBg={ true }
        >
            <div className={ classes.container }>
                <label>
                    <span>Room Name</span>
                    
                    <Input
                        type="text"
                        placeholder=""
                        ref={ roomNameField }
                    />
                </label>

                <Button onClick={ joinRoom }>Join</Button>
            </div>
        </CloseableModal>
    );
}
