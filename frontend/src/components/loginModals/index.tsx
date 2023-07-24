import { useContext, useState } from 'react';

import Button from '@/components/ui/button';
import CloseableModal from '@/components/ui/modals/closeableModal';
import StudentLoginModal from './studentLoginModal';
import TeacherLoginModal from './teacherLoginModal';

import { ModalContext } from '@/contexts/modalContext';

import classes from './styles.module.css';

type BaseLoginModalProps = {
    onClose: () => void;
}

export default function LoginModalBase(props: BaseLoginModalProps) {
    const [loginModalId, updateLoginModalId] = useState(-1);
    const { addModal, removeModal } = useContext(ModalContext);
    
    function teacherLogin() {
        updateLoginModalId(
            addModal(
                <TeacherLoginModal
                    onClose={ closeModal }
                />
            )
        );
    }

    function studentLogin() {
        updateLoginModalId(
            addModal(
                <StudentLoginModal
                    onClose={ closeModal }
                />
            )
        );
    }

    function closeModal() {
        removeModal(loginModalId);
    }

    return (
        <CloseableModal
            onClose={ props.onClose }
            title=""
            blurBg={ true }
        >
            <div className={ classes.content }>
                <Button onClick={ studentLogin }>Student Login</Button>
                <span />
                <Button onClick={ teacherLogin }>Teacher Login</Button>
            </div>
        </CloseableModal>
    );
}
