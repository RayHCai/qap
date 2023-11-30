import { type PropsWithChildren } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

import ModalBase, { BaseModalProps } from '..';
import Button from '@/components/ui/button';

import classes from './styles.module.css';

export type CloseableModalProps = BaseModalProps & {
    title: string;
    onClose: () => void;
    
    submitButtonText?: string;
    onSubmit?: () => void;
}

export default function CloseableModal(
    props: CloseableModalProps & PropsWithChildren
) {
    return (
        <ModalBase
            blurBg={ props.blurBg }
            darkenBg={ props.darkenBg }
        >
            <div className={ classes.container }>
                <div className={ classes.header }>
                    <h1>{ props.title }</h1>

                    <button
                        onClick={ () => props.onClose() }
                        className={ classes.closeButton }
                    >
                        <AiOutlineClose />
                    </button>
                </div>

                <div className={ classes.content }>
                    { props.children }
                </div>

                {
                    props.onSubmit &&
                        (
                            <div className={ classes.submitContainer }>
                                <Button onClick={ props.onSubmit }>
                                    { props.submitButtonText }
                                </Button>
                            </div>
                        )
                }
            </div>
        </ModalBase>
    );
}
