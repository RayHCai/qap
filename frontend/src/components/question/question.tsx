import MDEditor from '@uiw/react-md-editor';

import './question.css';

export default function Question(props: { question: Question }) {
    return (
        <div className="question-container">
            <h1>{ props.question.title }</h1>

            <MDEditor.Markdown className="q" source={ props.question.content } />

            {
                props.question.choices ? (
                    <div className="options-container">
                        {
                            props.question.choices.split(',').map(
                                (c, i) => (
                                    <div className="choice-container" key={ i }>
                                        <input type={ props.question.select_multiple ? "checkbox" : "radio" } />
                                        <p>{ c }</p>
                                    </div>
                                )
                            )
                        }
                    </div>
                ) : <textarea className="frq-sections" />
            }
        </div>
    );
}
