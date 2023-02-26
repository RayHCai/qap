import { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';

import MDEditor from '@uiw/react-md-editor';

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
        else navigate('/'); // TODO: store code in local storage so login bs doesnt happen
    }

    if(isLoading) return <Loading />;

    return (
        <div className="questions-container">
            {
                modalOpen ? (
                    <Modal closeModal={ () => updateModalState(false) }>
                        <input ref={ title } type="text" placeholder="Question Title" />

                        <MDEditor
                            className="md-editor"
                            visibleDragbar={ false }
                            value={ content }
                            onChange={ (v) => updateContent(v!) }
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