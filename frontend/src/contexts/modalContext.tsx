import { useState, createContext, type PropsWithChildren } from 'react';

export const ModalContext = createContext<
    {
        modals: JSX.Element[];
        addModal: (_: JSX.Element) => number;
        removeModal: (_: number) => void;
    }
>(
    {
        modals: [],
        addModal: (_: JSX.Element) => {
            return -1;
        },
        removeModal: (_: number) => {},
    }
);

export default function ModalContextWrapper({ children }: PropsWithChildren) {
    const [modals, updateModals] = useState<JSX.Element[]>([]);

    function addModal(modal: JSX.Element) {
        const index = modals.length;
        updateModals([...modals, modal]);

        return index;
    }

    function removeModal(index: number) {
        const newModals = [...modals].filter(
            (_, i) => (i !== index)
        );
     
        updateModals(newModals);
    }

    return (
        <ModalContext.Provider value={ { modals, addModal, removeModal } }>
            {
                modals.map(
                    (modal, index) => (
                        <div key={ index }>
                            { modal }
                        </div>
                    )
                )
            }

            { children }
        </ModalContext.Provider>
    );
}
