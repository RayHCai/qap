import {
    PropsWithChildren,
    forwardRef,
    useImperativeHandle,
    useRef,
    useState,
    createRef
} from 'react';
import {
    BsArrowDown,
    BsArrowUp,
    BsFillTrashFill,
    BsFillPencilFill,
    BsFillCheckSquareFill
} from 'react-icons/bs';
import { BiCopy } from 'react-icons/bi';
import { TfiClose } from 'react-icons/tfi';

import MDEditor from '@uiw/react-md-editor';

import { questionTypeCodeToString } from '../../helpers/questionsHelpers';

import classes from './questionCard.module.css';

type QuestionCardProps = {
    question: Question;
    questionNumber: number;
    isEdit: boolean;
    save: (i: number) => void;
    delete: (i: number) => void;
    edit: (i: number) => void;
    move: (i: number, dir: number) => void;
    copy: (i: number) => void;
    numQuestions: number;
}

type Choice = {
    value: string;
    isCorrect: boolean;
}

export type QuestionCardRef = {
    title: HTMLInputElement;
    points: HTMLInputElement;
    choices: Choice[];
    content: string;
}

function Sidebar(props: PropsWithChildren & { horizontal?: boolean }) {
    return (
        <div className={ classes.sidebar + (props.horizontal ? classes.sidebarHori : '') }>
            { props.children }
        </div>
    );
}

const QuestionCard = forwardRef(function(props: QuestionCardProps, ref) {
    const isFirstQuestion = props.questionNumber === 1;
    const isLastQuestion = props.numQuestions === props.questionNumber;

    const [content, updateContent] = useState(props.question.content);
    
    const choiceRefs = useRef<HTMLInputElement[]>([]);
    const correctOptions = useRef<HTMLInputElement[]>([]);

    const [choices, updateChoices] = useState<Choice[]>(
        props.question.choices.map(
            c => (
                {
                    value: c,
                    isCorrect: props.question.correctAnswer!.includes(c)
                }
            )
        )
    );

    if(choiceRefs.current.length !== choices.length) {
        choiceRefs.current = Array.from(choiceRefs.current)
            .map((_, i) => choiceRefs.current[i] || createRef());
        
        correctOptions.current = Array.from(correctOptions.current)
            .map((_, i) => correctOptions.current[i] || createRef());
    }

    const titleRef = useRef<HTMLInputElement>({} as HTMLInputElement);
    const numPoints = useRef<HTMLInputElement>({} as HTMLInputElement);

    useImperativeHandle(ref, () => (
        {
            get title() {
                return titleRef.current;
            },
            get points() {
                return numPoints.current;
            },
            get content() {
                return content;
            },
            get choices() {
                const newChoices = Array.from(choiceRefs.current).map(
                    (c, i) => (
                        {
                            value: c.value,
                            isCorrect: correctOptions.current[i].checked
                        }
                    )
                );

                return newChoices;
            }
        }
    ), [content, choices]);

    function addChoice() {
        updateChoices(
            [
                ...choices,
                {
                    value: '',
                    isCorrect: false
                }
            ]
        );
    }

    // TODO: make custom checkbox component so it doesn't look like ASS

    if(props.isEdit) {
        return (
            <div className={ classes.container }>
                <div className={ classes.header }>
                    <h1>{ props.questionNumber }.</h1>
                    
                    <input
                        ref={ titleRef }
                        className={ classes.title }
                        placeholder={ `Have a ${ questionTypeCodeToString(props.question) } question to ask?` }
                        type="text"
                        defaultValue={ props.question.title }
                    />

                    <input
                        ref={ numPoints }
                        className={ classes.points }
                        placeholder="Points"
                        type="number"
                        min={ 0 }
                        max={ 100000 }
                        defaultValue={ props.question.numPoints }
                    />

                    <Sidebar horizontal={ true }>
                        <BsFillCheckSquareFill
                            onClick={ () => props.save(props.questionNumber - 1) }
                            className={ classes.sidebarIcon}
                        />

                        <BsFillTrashFill
                            onClick={ () => props.delete(props.questionNumber - 1) }
                            className={ classes.sidebarIcon + ' ' + classes.trashIcon }
                        />
                    </Sidebar>
                </div>

                <MDEditor
                    visibleDragbar={ false }
                    value={ content }
                    onChange={ (e) => updateContent(e!) }
                />

                {
                    props.question.questionType !== 'sa' && (
                        <div className={ classes.choicesContainer }>
                            {
                                choices.map(
                                    (c, i) => (
                                        <div className={ classes.choice } key={ i }>
                                            <h1>{ i + 1 }.</h1>

                                            <input
                                                defaultChecked={ c.isCorrect }
                                                ref={r => correctOptions.current[i] = r! }
                                                type="checkbox" 
                                            />

                                            <input
                                                defaultValue={ c.value }
                                                ref={r => choiceRefs.current[i] = r!}
                                                type="text" 
                                            />

                                            <TfiClose className={ classes.deleteChoiceBtn } />
                                        </div>
                                    )
                                )
                            }

                            <button onClick={ addChoice }>+ Add Answer</button>
                        </div>
                    )
                }
            </div>
        );
    }

    return (
        <div className={ classes.container + ' ' + classes.displayContainer }>
            <Sidebar>
                <BsFillPencilFill
                    onClick={ () => props.edit(props.questionNumber - 1) }
                    className={ classes.sidebarIcon }
                />

                <BsFillTrashFill
                    onClick={ () => props.delete(props.questionNumber - 1) }
                    className={ classes.sidebarIcon + ' ' + classes.trashIcon }
                />

                <BsArrowUp
                    onClick={ () => props.move(props.questionNumber - 1, 1) }
                    className={ classes.sidebarIcon + (isFirstQuestion ? ' ' + classes.disabledIcon : '') }
                />

                <BsArrowDown
                    onClick={ () => props.move(props.questionNumber - 1, -1) }
                    className={ classes.sidebarIcon + (isLastQuestion ? ' ' + classes.disabledIcon : '') }
                />

                <BiCopy
                    onClick={ () => props.copy(props.questionNumber - 1) }
                    className={ classes.sidebarIcon }
                />
            </Sidebar>
            
            <div className={ classes.header }>
                <h1>{ props.questionNumber }.</h1>
                <h1>{ props.question.title }</h1>
                
                <p>{ props.question.numPoints } points</p>
            </div>

            {
                props.question.content.length > 0 && (
                    <MDEditor.Markdown
                        className={ classes.editor }
                        source={ props.question.content }
                    />
                )
            }

            <div>
                {
                    props.question.choices.map(
                        (c, i) => (
                            <div key={ i } className={ classes.notEditingChoicesContainer }>
                                <h1
                                    className={
                                        props.question.correctAnswer!.includes(c) ? classes.correctOption : ''
                                    }
                                >
                                    { i + 1 }.
                                </h1>

                                <p>{ c }</p>
                            </div>
                        )
                    )
                }
            </div>
        </div>
    );
});

export default QuestionCard;
