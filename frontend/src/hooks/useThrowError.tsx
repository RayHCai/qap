import { useContext, useState } from 'react';

import ErrorModal from '@/components/ui/modal/error';

import { ModalContext } from '@/contexts/modalContext';

export default function useThrowError() {
    const { openModal, closeModal } = useContext(ModalContext);

    const [modalIndex, updateModalIndex] = useState(-1);

    function onClose() {
        closeModal(modalIndex);
        updateModalIndex(-1);
    }

    return (error: string, title?: string) => {
        const index = openModal(
            <ErrorModal error={ error } title={ title } onClose={ onClose } />
        );

        updateModalIndex(index);
    };
}
