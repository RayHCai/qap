import { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';

import { IoCloseOutline } from 'react-icons/io5';

import Checkbox from '@/components/ui/checkbox';
import Button from '@/components/ui/button';

import classes from './styles.module.css';

type EditChoiceProps = {
    choiceIndex: number;
    choice: string;
    isCorrect: boolean;
    isTF?: boolean;

    delete: (index: number) => void;
    onSetCorrect?: (index: number) => void;
};

export type EditChoiceRef = {
    getChoiceContent: () => string;
    getIsCorrect: () => boolean;
};

const EditChoice = forwardRef(function (props: EditChoiceProps, ref) {
    const [isCorrect, updateIsCorrect] = useState(props.isCorrect);
    const [choiceContent, updateChoiceContent] = useState<string | undefined>(
        props.choice
    );

    useEffect(() => {
        updateIsCorrect(props.isCorrect);
    }, [props.isCorrect]);

    useImperativeHandle(ref, () => ({
        getChoiceContent: () => choiceContent,
        getIsCorrect: () => isCorrect,
    }));

    if (props.isTF)
        return (
            <Button
                onClick={ () => {
                    if (!isCorrect) {
                        updateIsCorrect(true);
                        props.onSetCorrect!(props.choiceIndex);
                    }
                } }
                className={ `${
                    isCorrect && choiceContent === 'True' ? classes.true : ''
                }
                    ${
                        isCorrect && choiceContent === 'False'
                            ? classes.false
                            : ''
                    }
                    ` }
            >
                { choiceContent }
            </Button>
        );

    return (
        <div className={ classes.container }>
            <h3 className={ isCorrect ? classes.correct : '' }>
                { props.choiceIndex + 1 }.
            </h3>

            <Checkbox
                onClick={ () => updateIsCorrect(!isCorrect) }
                checked={ isCorrect }
            />

            <div className={ classes.mdContainer }>
                <MDEditor
                    height="100%"
                    visibleDragbar={ false }
                    value={ choiceContent }
                    onChange={ updateChoiceContent }
                />
            </div>

            <IoCloseOutline
                className={ classes.closeButton }
                onClick={ () => props.delete(props.choiceIndex) }
            />
        </div>
    );
});

export default EditChoice;
