import { forwardRef } from 'react';

import MDEditor from '@uiw/react-md-editor';

import './question.css';

const Question = forwardRef<HTMLFormElement & HTMLTextAreaElement, { question: Question, answers: Answer[], curQ: number }>((props, ref) => {
    return (
        <div className="question-container">
            <h1>{ props.question.title }</h1>

            <MDEditor.Markdown className="q" source={ props.question.content } />

            {
                props.question.choices ? (
                    <div className="options-container">
                        <form ref={ ref }>
                            {
                                props.question.choices.split(',').map(
                                    (c, i) => (
                                        <div className="choice-container" key={ i }>
                                            <input
                                                type={ props.question.select_multiple ? "checkbox" : "radio" } 
                                                value={ c } 
                                                name="choice"
                                                defaultChecked={ c === props.answers[props.curQ].answer }
                                            />

                                            <p>{ c }</p>
                                        </div>
                                    )
                                )
                            }
                        </form>
                    </div>
                ) : (
                    <textarea
                        ref={ ref } 
                        className="frq-sections"
                        defaultValue={ props.answers[props.curQ].answer }
                    />
                )
            }
        </div>
    );
});

export default Question;