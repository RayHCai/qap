import { PropsWithChildren } from 'react';
import { GrClose } from 'react-icons/gr';

import './modal.css';

interface ModalProps extends PropsWithChildren {
    closeModal?: () => void;
}

export default function Modal(props: ModalProps) {
    return (
        <div className="modal-container">
            {
                props.closeModal !== undefined ? <GrClose className="close-modal-button" onClick={ () => props.closeModal!() } /> : <></>
            }

            <div className="modal-content-container">
                { props.children }
            </div>
        </div>
    );
}

export function ErrorModal(props: ModalProps) {
    return (
        <Modal>
            { props.children }

            <button className="styled-button" onClick={ props.closeModal }>Close</button>
        </Modal>
    );
}
