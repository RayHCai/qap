import { useContext, useState } from 'react';

import ErrorModal from '@/components/ui/modal/error';

import { ModalContext } from '@/contexts/modalContext';

export default function useThrowError(error: string, title?: string) {
    const { openModal, closeModal } = useContext(ModalContext);

    const [modalIndex, updateModalIndex] = useState(-1);

    function onClose() {
        closeModal(modalIndex);
        updateModalIndex(-1);
    }

    return () => {
        const index = openModal(
            <ErrorModal error={ error } title={ title } onClose={ onClose } />
        );

        updateModalIndex(index);
    };
}
