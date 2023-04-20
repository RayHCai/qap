import { forwardRef, useState } from 'react';

import MDEditor from '@uiw/react-md-editor';

import classes from './question.module.css';

const Question = forwardRef<HTMLDivElement & HTMLTextAreaElement, { question: Question, answer: Answer }>((props, ref) => {
    const [checked, updateChecked] = useState<boolean[]>(
        (function() {
            if(props.question.choices!.length === 0) return [];

            return props.question.choices.map(
                c => props.answer.selected!.includes(c)
            );
        })()
    );

    function check(newCheck: boolean, i: number) {
        let newChecked = [...checked];
        newChecked[i] = newCheck;

        updateChecked(newChecked);
    }

    // TODO make checkboxes not ass

    return (
        <div className={ classes.questionContainer }>
            <h1>{ props.question.title }</h1>

            {
                props.question.content.length > 0 && <MDEditor.Markdown className={ classes.content } source={ props.question.content } />
            }

            {
                props.question.choices!.length > 0 ? (
                    <div className={ classes.optionsContainer }>
                        <div ref={ ref }>
                            {
                                props.question.choices.map(
                                    (c, i) => (
                                        <div className={ classes.choiceContainer } key={ i }>
                                            <input
                                                type={ props.question.correctAnswer!.length > 1 ? 'checkbox' : 'radio' } 
                                                value={ c } 
                                                name={ `choice${ props.question.id }` }
                                                checked={ checked[i] }
                                                onChange={ (e) => check(e.target.checked, i) }
                                            />

                                            <p>{ c }</p>
                                        </div>
                                    )
                                )
                            }
                        </div>
                    </div>
                ) : (
                    <textarea
                        ref={ ref } 
                        className={ classes.frqBox }
                        defaultValue={ props.answer.textAnswer }
                    />
                )
            }
        </div>
    );
});

export default Question;
