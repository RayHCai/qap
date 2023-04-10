import MDEditor from '@uiw/react-md-editor';

import classes from './questionCard.module.css';

type QuestionCardProps = {
    question: Question;
    questionNumber: number;
    isEdit: boolean;
    delete: (i: number) => void;
    save?: (i: number) => void;
}

export default function QuestionCard(props: QuestionCardProps) {
    if(props.question.title.length === 0) {
        return (
            <div className={ classes.container }>
                <div className={ classes.header }>
                    <h1>{ props.questionNumber }.</h1>
                    
                    <input className={ classes.title } placeholder="Have a multiple-choice question to ask?" type="text" />
                    <input className={ classes.points } placeholder="Points" type="number" min={ 0 } max={ 100000 } />
                </div>

                <MDEditor
                    visibleDragbar={ false }
                />

                {}
            </div>
        );
    }

    return (
        <div className={ classes.container }>
            <h1>{ props.question.title }</h1>
        </div>
    );
}
