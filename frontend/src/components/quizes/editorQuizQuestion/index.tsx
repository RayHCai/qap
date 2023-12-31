import { useRef } from 'react';

import QuestionSidebar from './questionSidebar';
import QuestionListItem from './questionListItem';
import EditQuestion, { EditQuestionRef } from './editQuestion';

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
}

export default function EditorQuizQuestion(props: EditorQuizQuestionProps) {
    const editQuestionRef = useRef<EditQuestionRef>();
    
    function saveQuestion(questionIndex: number) {
        props.save(questionIndex, editQuestionRef.current!.getQuestion());
    }

    return (
        <div className={ classes.container }>
            {
                props.isEditing ? <EditQuestion { ...props } ref={ editQuestionRef } /> : <QuestionListItem { ...props } />
            }

            <QuestionSidebar
                { ...props }
                save={ saveQuestion }
            />
        </div>
    );
}
