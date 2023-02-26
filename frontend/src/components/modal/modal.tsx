import { PropsWithChildren } from 'react';
import { GrClose } from 'react-icons/gr';

import './modal.css';

export default function Modal(props: PropsWithChildren & { closeModal: () => void }) {
    return (
        <div className="modal-container">
            <GrClose className="close-modal-button" onClick={ () => props.closeModal() } />

            <div className="modal-content-container">
                { props.children }
            </div>
        </div>
    );
}
