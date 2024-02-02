import { useState, createContext, type PropsWithChildren } from 'react';

type ModalContext = {
    openModal: (content: JSX.Element) => number;
    closeModal: (index: number) => void;
};

export const ModalContext = createContext<ModalContext>({
    openModal: (_content: JSX.Element) => -1,
    closeModal: (_index: number) => {},
});

export default function ModalContextWrapper({ children }: PropsWithChildren) {
    const [modals, updateModals] = useState<JSX.Element[]>([]);

    function closeModal(index: number) {
        const newModals = [...modals].filter((_, i) => i !== index);

        updateModals(newModals);
    }

    function openModal(modal: JSX.Element) {
        const index = modals.length;

        updateModals([...modals, modal]);

        return index;
    }

    return (
        <ModalContext.Provider value={ { openModal, closeModal } }>
            { modals.map((modal, i) => (
                <div key={ i }>{ modal }</div>
            )) }

            { children }
        </ModalContext.Provider>
    );
}
