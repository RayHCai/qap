import { useState, createContext, type PropsWithChildren } from 'react';

export const ModalContext = createContext<
    {
        modals: JSX.Element[];
        addModal: (_: JSX.Element) => void;
    }
>(
    {
        modals: [],
        addModal: (_: JSX.Element) => {},
    }
);

export default function ModalContextWrapper({ children }: PropsWithChildren) {
    const [modals, updateModals] = useState<JSX.Element[]>([]);

    function addModal(modal: JSX.Element) {
        updateModals([...modals, modal]);
    }

    return (
        <ModalContext.Provider value={ { modals, addModal } }>
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
