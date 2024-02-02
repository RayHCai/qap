import { useRef } from 'react';

import QuestionSidebar from './questionSidebar';
import QuestionListItem from './questionListItem';
import EditQuestion, { EditQuestionRef } from './editQuestion';

import useThrowError from '@/hooks/useThrowError';

import classes from './styles.module.css';

export type EditorQuizQuestionProps = {
    questionIndex: number;
    numQuestions: number;
    question: Question;
    isEditing: boolean;

    setEditing: (questionIndex: number) => void;
    save: (questionIndex: number, question: Question) => void;
    delete: (questionIndex: number) => void;
    move: (questionIndex: number, dir: number) => void;
    copy: (i: number) => void;
};

export default function EditorQuizQuestion(props: EditorQuizQuestionProps) {
    const throwError = useThrowError();

    const editQuestionRef = useRef<EditQuestionRef>();

    function saveQuestion(questionIndex: number) {
        const question = editQuestionRef.current!.getQuestion();

        if(question.numPoints === undefined || Number.isNaN(question.numPoints) || question.numPoints < 0) throwError('Invalid number of points');
        else if(question.content === undefined || question.content.replaceAll(' ', '').length === 0) throwError('Question content cannot be empty');
        else if(question.questionType === QuestionType.MC && question.choices.length < 2) throwError('Multiple choice questions must have at least 2 choices');
        else props.save(questionIndex, editQuestionRef.current!.getQuestion());
    }

    return (
        <div className={ classes.container }>
            { props.isEditing ? (
                <EditQuestion { ...props } ref={ editQuestionRef } />
            ) : (
                <QuestionListItem { ...props } />
            ) }

            <QuestionSidebar { ...props } save={ saveQuestion } />
        </div>
    );
}
