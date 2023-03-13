import { forwardRef, useState } from 'react';

import MDEditor from '@uiw/react-md-editor';

import './question.css';

const Question = forwardRef<HTMLDivElement & HTMLTextAreaElement, { question: Question, answer: Answer }>((props, ref) => {
    const [checked, updateChecked] = useState<boolean[]>(
        (function() {
            if(!props.question.choices) return [];

            let temp = (new Array(props.question.choices.split(',').length)).fill(false);

            if(props.answer.answer.length === 0) return temp;

            temp = temp.map(
                (_, i) => props.question.choices!.split(',')[i] === props.answer.answer
            );

            return temp;
        })()
    );

    function check(newCheck: boolean, i: number) {
        let newChecked = [...checked];
        newChecked[i] = newCheck;

        updateChecked(newChecked);
    }

    return (
        <div className="question-container">
            <h1>{ props.question.title }</h1>

            <MDEditor.Markdown className="q" source={ props.question.content } />

            {
                props.question.choices ? (
                    <div className="options-container">
                        <div ref={ ref }>
                            {
                                props.question.choices.split(',').map(
                                    (c, i) => (
                                        <div className="choice-container" key={ i }>
                                            <input
                                                type={ props.question.select_multiple ? "checkbox" : "radio" } 
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
                        className="frq-sections"
                        defaultValue={ props.answer.answer }
                    />
                )
            }
        </div>
    );
});

export default Question;