import { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';

import MDEditor from '@uiw/react-md-editor';
import CodeEditor from '@uiw/react-textarea-code-editor';

import { UserContext } from '../../contexts/userContext';

import Loading from '../../components/loading/loading';
import Question from '../../components/question';
import Modal from '../../components/modal/modal';

import { SERVER_URL } from '../../settings';

import './editQuestions.css';

export default function EditQuestions() {
    const navigate = useNavigate();
    const { code } = useContext(UserContext);

    const [questions, updateQuestions] = useState([] as Question[]);
    const [isLoading, updateLoading] = useState(false);
    const [modalOpen, updateModalState] = useState(false);

    const title = useRef({} as HTMLInputElement);

    const [content, updateContent] = useState('');

    useEffect(() => {
        updateLoading(true);

        (async function() {
            const res = await fetch(`${ SERVER_URL }/questions/${ code }/`);
            const data = await res.json();

            updateQuestions(data.data);
            updateLoading(false);
        })();
    }, [code]);

    async function createQuestion() {
        const t = title.current.value.replaceAll(' ', '');
        const c = content;

        if(t.length === 0 || c.replaceAll(' ', '').length === 0) {
            alert('Title and Content cannot be empty');

            return;
        }

        const res = await fetch(`${ SERVER_URL }/questions/${ code }/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    title: t,
                    content: c
                }
            )
        });
        
        const json = await res.json();

        if(!res.ok) alert(json.message);
        else navigate(0);
    }

    if(isLoading) return <Loading />;

    return (
        <div className="questions-container">
            {
                modalOpen ? (
                    <Modal closeModal={ () => updateModalState(false) }>
                        <input ref={ title } type="text" placeholder="Question Title" />

                        {/* <MDEditor
                            value={ content }
                            onChange={ (v) => updateContent(v!) }
                        /> */}
                        
                        <CodeEditor
                            className="code-editor"
                            value={ content }
                            language="js"
                            placeholder="Please enter JS code."
                            onChange={ (evn) => updateContent(evn.target.value) }
                        />

                        <button onClick={ createQuestion }>Create</button>
                    </Modal>
                ) : <></>
            }

            <h1>Questions for { code }</h1>

            <button onClick={ () => updateModalState(true) }>Add a quesiton</button>

            {
                questions.map(
                    q => <Question title={ q.title } content={ q.content } />
                )
            }
        </div>
    );
}