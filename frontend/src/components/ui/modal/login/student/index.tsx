import { useRef } from 'react';

import Input from '@/components/ui/input';
import CloseableModal from '../../closeable';

import classes from './styles.module.css';

type StudentLoginModalProps = {
    onClose: () => void;
};

export default function StudentLoginModal(props: StudentLoginModalProps) {
    const roomNameField = useRef<HTMLInputElement>(null);

    async function joinRoom() {
        // const roomName = roomNameField.current!.value;
    }

    return (
        <CloseableModal
            blurBg={ true }
            title="Join Room"
            onClose={ () => props.onClose() }
            onSubmit={ joinRoom }
            submitButtonText="Join"
        >
            <div className={ classes.container }>
                <label>
                    <span>Room Name</span>

                    <Input type="text" placeholder="" ref={ roomNameField } />
                </label>
            </div>
        </CloseableModal>
    );
}
