import { PropsWithChildren } from 'react';
import { GrClose } from 'react-icons/gr';

import classes from './modal.module.css';

interface ModalProps extends PropsWithChildren {
    closeModal?: () => void;
}

export default function Modal(props: ModalProps) {
    return (
        <div className={ classes.modalContainer }>
            {
                props.closeModal !== undefined ? 
                    <GrClose
                        className={ classes.closeModalSVG }
                        onClick={ () => props.closeModal!() }
                    /> 
                    : <></>
            }

            <div className={ classes.modalContent }>
                { props.children }
            </div>
        </div>
    );
}

export function ErrorModal(props: ModalProps) {
    return (
        <Modal>
            { props.children }

            <button className={ classes.closeErrorModal } onClick={ props.closeModal }>Close</button>
        </Modal>
    );
}

export type ConfirmModalProps = {
    setStatus: (confirmed: boolean) => void;
};

export function ConfirmModal(props: ConfirmModalProps & ModalProps) {
    return (
        <Modal>
            { props.children }

            <div className={ classes.confirmModalButtons }>
                <button className={ classes.confirmModalButton } onClick={ () => props.setStatus(true) }>Ok</button>
                <button className={ classes.confirmModalButton } onClick={ () => props.setStatus(false) }>Cancel</button>
            </div>
        </Modal>
    );
}
