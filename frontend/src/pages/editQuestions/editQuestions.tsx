import { useContext, useEffect, useState, useRef } from 'react';

import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { FaTrashAlt } from 'react-icons/fa';

import MDEditor from '@uiw/react-md-editor';

import { UserContext } from '../../contexts/userContext';

import Loading from '../../components/loading/loading';
import Modal from '../../components/modal/modal';

import { SERVER_URL } from '../../settings';

import './editQuestions.css';

type ChangeParameters = boolean | {
    content?: string,
    title?: string
};

type EditQuestionProps = {
    title: string;
    visible: boolean;
    changeVisibility: (v: boolean) => void;
    delete: () => void;
    openModal: () => void;
};

function EditQuestionComponent(props: EditQuestionProps) {
    return (
        <div className="edit-question-content">
            <nav>
                {
                    !props.visible ? 
                        <AiFillEyeInvisible 
                            onClick={ () => props.changeVisibility(true) } 
                            className="edit-quesiton-nav-icon" 
                        /> 
                    : 
                        <AiFillEye 
                            onClick={ () => props.changeVisibility(false) } 
                            className="edit-quesiton-nav-icon" 
                        />
                } 

                <FaTrashAlt onClick={ props.delete } className="edit-quesiton-nav-icon" />   
            </nav>

            <h3 onClick={ props.openModal }>{ props.title }</h3>
        </div>
    );
}

export default function EditQuestions() {
    const { code } = useContext(UserContext);

    const [questions, updateQuestions] = useState([] as Question[]);
    const [isLoading, updateLoading] = useState(false);
    const [modalOpen, updateModalState] = useState(false);

    const [isUpdateModalOpen, updateUpdateModalState] = useState(false);
    const [updatingId, updateId] = useState('');

    const [updatingTitle, updateUpdatingTitle] = useState('');
    const [content, updateContent] = useState('');

    const title = useRef({} as HTMLInputElement);

    async function fetchQuestions() {
        const res = await fetch(`${ SERVER_URL }/questions/${ code }/`);
        const data = await res.json();

        updateQuestions(data.data);
    }

    useEffect(() => {
        updateLoading(true);

        (async function() {
            await fetchQuestions();

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
        else {
            fetchQuestions();
            updateModalState(false);  
        }
    }

    async function editQuestion(id: string, changeObj: ChangeParameters) {
        updateLoading(true);
        
        const res = await fetch(`${ SERVER_URL }/update/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    id: id,
                    change: changeObj
                }
            )
        });

        const json = await res.json();

        if(!res.ok) alert(json.message);
        else fetchQuestions();

        updateLoading(false)
    }

    async function deleteQuesiton(id: string) {
        if(!window.confirm('Are you sure you want to delete this question?')) return;
        
        updateLoading(true);

        const res = await fetch(`${ SERVER_URL }/delete/question/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    id: id
                }
            )
        });

        const json = await res.json();

        if(!res.ok) alert(json.message);
        else fetchQuestions();

        updateLoading(false);
    }

    function updateQuestion() {
        editQuestion(updatingId, {
            title: title.current.value,
            content: content
        });

        updateContent('');
        updateUpdateModalState(false);
    }

    if(isLoading) return <Loading />;

    return (
        <div className="questions-container">
            {
                modalOpen ? (
                    <Modal 
                        closeModal={
                            () => {
                                updateModalState(false);
                                updateContent('');
                            }
                        }
                    >
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

            {
                isUpdateModalOpen ? (
                    <Modal 
                        closeModal={
                            () => {
                                updateUpdateModalState(false);
                                updateContent('');
                            }
                        }
                    >
                        <input ref={ title } defaultValue={ updatingTitle } type="text" placeholder="Question Title" />

                        <MDEditor
                            className="md-editor"
                            visibleDragbar={ false }
                            value={ content }
                            onChange={ (v) => updateContent(v!) }
                        />

                        <button onClick={ updateQuestion }>Update</button>
                    </Modal>
                ) : <></>
            }

            <h1>Questions for { code }</h1>

            <button onClick={ () => updateModalState(true) }>Add a quesiton</button>

            <div className="questions-content">
                {
                    questions.map(
                        (q, i) => (
                            <EditQuestionComponent 
                                key={ i }
                                title={ q.title } 
                                visible={ q.visible } 
                                changeVisibility={
                                    (v: boolean) => editQuestion(q.id, v)
                                }
                                delete={
                                    () => deleteQuesiton(q.id)
                                }
                                openModal={
                                    () => {
                                        
                                        updateUpdateModalState(true);
                                        updateId(q.id);
                                        updateContent(q.content);
                                        updateUpdatingTitle(q.title);
                                    }
                                }
                            />
                        )
                    )
                }
            </div>
        </div>
    );
}
