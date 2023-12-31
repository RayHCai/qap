import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import MDEditor from '@uiw/react-md-editor';

import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import EditChoice, { EditChoiceRef } from './editChoice';

import { EditorQuizQuestionProps } from '..';

import classes from './styles.module.css';

export type EditQuestionRef = {
    getQuestion: () => Question;
}

const EditQuestion = forwardRef(function(props: EditorQuizQuestionProps, ref) {
    const [questionContent, updateQuestionContent] = useState<string | undefined>('');
    const [choices, updateChoices] = useState(props.question.choices);

    const [tfCorrect, updateCorrect] = useState(props.question.correctAnswer![0]);

    const choicesRef = useRef<EditChoiceRef[]>([]);
    const numPointsRef = useRef<HTMLInputElement>({} as HTMLInputElement);

    useImperativeHandle(
        ref, 
        () => (
            {
                getQuestion: () => {
                    const newChoices = choicesRef.current.map(
                        (choiceRef) => choiceRef.getChoiceContent()
                    );

                    const correctAnswers = choicesRef.current.map(
                        (choiceRef) => choiceRef.getIsCorrect()
                    ).map(
                        (isCorrect, index) => isCorrect ? newChoices[index] : undefined
                    ).filter(
                        (isCorrect) => isCorrect !== undefined
                    );

                    return {
                        ...props.question,
                        content: questionContent,
                        numPoints: parseInt(numPointsRef.current.value),
                        choices: newChoices,
                        correctAnswer: correctAnswers
                    };
                },
            }
        )
    );

    function deleteChoice(choiceIndex: number) {
        const newChoices = [...choices];
        newChoices.splice(choiceIndex, 1);

        updateChoices(newChoices);
    }

    function addChoice() {
        const newChoices = [...choices];
        newChoices.push('');

        updateChoices(newChoices);
    }

    function onSetCorrect(choiceIndex: number) {
        updateCorrect(choiceIndex === 0 ? 'True' : 'False');
    }

    return (
        <div className={ classes.container }>
            <div className={ classes.header }>
                <h2>{ props.questionIndex + 1 }.</h2>

                <div className={ classes.markdownContainer }>
                    <MDEditor
                        height="100%"
                        visibleDragbar={ false }
                        value={ questionContent }
                        onChange={ updateQuestionContent }
                    />
                </div>

                <Input type="number" placeholder="Points" ref={ numPointsRef } />
            </div>

            {
                props.question.questionType === QuestionType.MC && (
                    <>
                        <div className={ classes.choices }>
                            {
                                choices.map(
                                    (choice, index) => (
                                        <EditChoice
                                            key={ index }
                                            choiceIndex={ index }
                                            choice={ choice }
                                            isCorrect={ props.question.correctAnswer!.includes(choice) }
                                            delete={ deleteChoice }
                                            ref={
                                                (ref: EditChoiceRef) => {
                                                    if(choicesRef.current.length <= index) choicesRef.current.push(ref);

                                                    choicesRef.current[index] = ref;
                                                }
                                            }
                                        />
                                    )
                                )
                            }
                        </div>

                        <div>
                            <Button onClick={ addChoice } light={ true }>Add Answer</Button>
                        </div>
                    </>
                )
            }

            {
                props.question.questionType === QuestionType.TF && (
                    <div className={ classes.tfChoices }>
                        <EditChoice
                            choiceIndex={ 0 }
                            choice="True"
                            isCorrect={ tfCorrect === 'True' }
                            isTF={ true }
                            delete={ deleteChoice }
                            ref={
                                (ref: EditChoiceRef) => {
                                    if(choicesRef.current.length <= 0) choicesRef.current.push(ref);

                                    choicesRef.current[0] = ref;
                                }
                            }
                            onSetCorrect={ onSetCorrect }
                        />

                        <EditChoice
                            choiceIndex={ 1 }
                            choice="False"
                            isCorrect={ tfCorrect === 'False' }
                            isTF={ true }
                            delete={ deleteChoice }
                            ref={
                                (ref: EditChoiceRef) => {
                                    if(choicesRef.current.length <= 1) choicesRef.current.push(ref);

                                    choicesRef.current[1] = ref;
                                }
                            }
                            onSetCorrect={ onSetCorrect }
                        />
                    </div>
                )
            }
        </div>
    );
});

export default EditQuestion;
