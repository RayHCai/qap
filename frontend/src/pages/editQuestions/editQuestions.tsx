import { useContext, useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router';

import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { FaTrashAlt } from 'react-icons/fa';

import MDEditor from '@uiw/react-md-editor';

import { TeacherContext } from '../../contexts/teacherContext';
import { ErrorContext } from '../../contexts/errorContext';

import Loading from '../../components/loading/loading';
import Modal from '../../components/modal/modal';

import EditChoice from './editChoice';

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
    const { classId } = useParams();
    const { user } = useContext(TeacherContext);
    const { throwError } = useContext(ErrorContext);

    const [classObj, updateClass] = useState<Quiz>();

    const [questions, updateQuestions] = useState([] as Question[]);
    const [isLoading, updateLoading] = useState(false);
    const [modalOpen, updateModalState] = useState(false);

    const [isUpdateModalOpen, updateUpdateModalState] = useState(false);
    const [updatingId, updateId] = useState('');
    const [updatingSelectBox, updateSelectBoxState] = useState(false);
    const [updatingCorrectAnswer, updateCorrectAnswer] = useState('');

    const [updatingTitle, updateUpdatingTitle] = useState('');
    const [content, updateContent] = useState('');

    type Choice = { value: string; correct: boolean };

    const [choices, updateChoices] = useState<Choice[]>([]);

    const title = useRef({} as HTMLInputElement);
    const selectMultiple = useRef({} as HTMLInputElement)
    const correctAnswer = useRef({} as HTMLInputElement)

    const fetchQuestions = useCallback(async function() {
        const res = await fetch(`${ SERVER_URL }/questions/${ classId }/`);
        const json = await res.json();

        if(!res.ok) throwError(json.message);
        else updateQuestions(json.data);
    }, []);

    const fetchClass = useCallback(async function() {
        const res = await fetch(`${ SERVER_URL }/classes/${ classId }/`);
        const json = await res.json();

        if(!res.ok) throwError(json.message);
        else updateClass(json.data);
    }, []);

    useEffect(() => {
        updateLoading(true);

        (async function() {
            await fetchQuestions();
            await fetchClass();

            updateLoading(false);
        })();

    }, [fetchQuestions, fetchClass]);

    async function createQuestion() {
        const t = title.current.value.replaceAll(' ', '');
        const c = content;

        if(t.length === 0 || c.replaceAll(' ', '').length === 0) {
            throwError('Title and Content cannot be empty');

            return;
        }

        const res = await fetch(`${ SERVER_URL }/questions/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    title: t,
                    content: c,
                    is_visible: true,
                    question_for: classId,
                    choices: choices,
                    required: true,
                    ...(
                        {
                            select_multiple: correctAnswer
                        }
                    )
                    // ...(
                    //     choices.length === 0 ? {} : {
                    //         choices: choices.map(
                    //             c => c.value
                    //         ).join(','),
                    //         select_multiple: selectMultiple.current.checked,
                    //         correct: correctAnswer.current.value
                    //     }
                    // )
                }
            )
        });
        
        console.log(choices);

        const json = await res.json();

        if(!res.ok) alert(json.message);
        else {
            fetchQuestions();
            refreshState();
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
        // !TODO: make this a modal
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
        const stringifiedQuestion = choices.map(
            c => c.value
        ).join(',');

        editQuestion(updatingId, {
            title: title.current.value,
            content: content,
            ...(
                choices.length === 0 ? {} : {
                    choices: stringifiedQuestion,
                    select_multiple: updatingSelectBox,
                    correct: updatingCorrectAnswer
                }
            )
        });

        refreshState();
    }

    function deleteChoice(index: number) {
        let newChoices = [...choices];

        newChoices = newChoices.filter(
            (_, i) => i !== index
        );

        updateChoices(newChoices);
    }

    function changeChoice(index: number, value: string) {
        let newChoices = [...choices];

        newChoices[index] = { value: value, correct: false };
        
        console.log(newChoices);

        updateChoices(newChoices);
    }

    function changeCorrect(index: number, checked: boolean) {
        let newChoices = [...choices];

        newChoices[index].correct = checked;

        console.log(newChoices);

        updateChoices(newChoices);
    }

    function refreshState() {
        updateModalState(false);
        updateUpdateModalState(false);
        updateContent('');
        updateChoices([]);
        updateSelectBoxState(false);
        updateCorrectAnswer('');
    }

    if(isLoading) return <Loading />;

    return (
        <div className="questions-container">
            {
                modalOpen ? (
                    <Modal 
                        closeModal={ refreshState }
                    >
                        <input ref={ title } type="text" placeholder="Question Title" />

                        <MDEditor
                            className="md-editor"
                            visibleDragbar={ false }
                            value={ content }
                            onChange={ (v) => updateContent(v!) }
                        />

                        <div>
                            <button onClick={ () => updateChoices([...choices, { value: '', correct: false }]) }>
                                Add choice
                            </button>

                            <div className="select-multiple-container">
                                <label>Allow Multiple Choices</label>
                                <input type="checkbox" ref={ selectMultiple } disabled={ choices.length === 0 } />
                            </div>

                            <div className="correct-answer-container">
                                <label>Correct Answer</label>
                                <input type="text" className="choice-input" ref={ correctAnswer } disabled={ choices.length === 0 } />
                            </div>

                            <div className="choices-container">
                                {
                                    choices.map(
                                        (c, index) => (
                                            <EditChoice 
                                                deleteChoice={ () => deleteChoice(index) }
                                                changeChoice={ (v) => changeChoice(index, v) }
                                                changeCorrect={ (v) => changeCorrect(index, v) }
                                                correct={ c.correct }
                                                value={ c.value }
                                                key={ index }
                                            />
                                        )
                                    )
                                }
                            </div>
                        </div>

                        <button onClick={ createQuestion }>Create</button>
                    </Modal>
                ) : <></>
            }

            {
                isUpdateModalOpen ? (
                    <Modal 
                        closeModal={ refreshState }
                    >
                        <input ref={ title } defaultValue={ updatingTitle } type="text" placeholder="Question Title" />

                        <MDEditor
                            className="md-editor"
                            visibleDragbar={ false }
                            value={ content }
                            onChange={ (v) => updateContent(v!) }
                        />

                        <div>
                            <button onClick={ () => updateChoices([...choices, { value: '', correct: false }]) }>
                                Add choice
                            </button>

                            <div className="select-multiple-container">
                                <label>Allow Multiple Choices</label>

                                <input 
                                    type="checkbox" 
                                    onChange={ (e) => updateSelectBoxState(e.target.checked) } 
                                    checked={ updatingSelectBox } 
                                    disabled={ choices.length === 0 } 
                                />
                            </div>

                            <div className="correct-answer-container">
                                <label>Correct Answer</label>
                                <input 
                                    type="text" 
                                    className="choice-input" 
                                    value={ updatingCorrectAnswer } 
                                    disabled={ choices.length === 0 }
                                    onChange={ (e) => updateCorrectAnswer(e.target.value) } 
                                />
                            </div>

                            <div className="choices-container">
                                {
                                    choices.map(
                                        (c, index) => (
                                            <div className="choice-container" key={ index }>
                                                <EditChoice 
                                                    deleteChoice={ () => deleteChoice(index) }
                                                    changeChoice={ (v) => changeChoice(index, v) }
                                                    changeCorrect={ (v) => changeCorrect(index, v) }
                                                    correct={ c.correct }
                                                    value={ c.value }
                                                    key={ index }
                                                />
                                            </div>
                                        )
                                    )
                                }
                            </div>
                        </div>

                        <button onClick={ updateQuestion }>Update</button>
                    </Modal>
                ) : <></>
            }

            <h1>Questions for { classObj!.name }</h1>

            <button onClick={ () => updateModalState(true) }>Add a quesiton</button>

            <div className="questions-content">
                {
                    questions.map(
                        (q, i) => (
                            <EditQuestionComponent 
                                key={ i }
                                title={ q.title } 
                                visible={ q.isVisible } 
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

                                        if(q.selectMultiple) updateSelectBoxState(q.selectMultiple);
                                        // if(q.correctAnswer) updateCorrectAnswer(q.correctAnswer);

                                        updateChoices(
                                            q.choices ? q.choices.map(
                                                s => {
                                                    let isCorrect = false;

                                                    if(q.correctAnswer!.includes(s)) isCorrect = true;

                                                    return { value: s, correct: isCorrect };
                                                }
                                            ) 
                                            : [] as Choice[]
                                        );
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
