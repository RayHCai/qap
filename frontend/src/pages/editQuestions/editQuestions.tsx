import { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';

import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { FaTrashAlt } from 'react-icons/fa';

import MDEditor from '@uiw/react-md-editor';

import { UserContext } from '../../contexts/userContext';

import Loading from '../../components/loading/loading';
import Modal from '../../components/modal/modal';

import { SERVER_URL } from '../../settings';

import './editQuestions.css';

type ChangeParameters = boolean | {
    content?: string
    title?: string
};

function EditQuestionComponent(props: { title: string, visible: boolean, changeVisibility: (v: boolean) => void }) {
    const [isVisible, updateVisibility] = useState(props.visible);

    return (
        <div className="edit-question-content">
            <nav>
                
            </nav>
            <h3>{ props.title }</h3>
        </div>
    );
}

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

    function editQuestion(id: string, changeObj: ChangeParameters) {

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

            <div className="questions-content">
                {
                    questions.map(
                        (q, i) => <EditQuestionComponent title={ q.title } key={ i } visible={ true } changeVisibility={ (v: boolean) => editQuestion(q.id, v) } />
                    )
                }
            </div>
        </div>
    );
}
