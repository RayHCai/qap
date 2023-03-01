import MDEditor from '@uiw/react-md-editor';

import './question.css';

export default function Question(props: { title: string, content: string }) {
    return (
        <div className="question-container">
            <h1>{ props.title }</h1>

            <MDEditor.Markdown className="q" source={ props.content } />
        </div>
    );
}
