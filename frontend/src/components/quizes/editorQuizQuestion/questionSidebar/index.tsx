import {
    BsArrowDown,
    BsArrowUp,
    BsFillTrashFill,
    BsFillPencilFill,
    BsCopy,
    BsCheckSquare,
} from 'react-icons/bs';

import { EditorQuizQuestionProps } from '..';

import classes from './styles.module.css';

type QuestionSidebarProps = Omit<EditorQuizQuestionProps, 'save'> & {
    save: (questionIndex: number) => void;
};

export default function QuestionSidebar(props: QuestionSidebarProps) {
    return (
        <div className={ classes.sidebar }>
            { props.isEditing && (
                <BsCheckSquare
                    className={ classes.icon }
                    onClick={ () => props.save(props.questionIndex) }
                />
            ) }

            <BsFillPencilFill
                className={ classes.icon }
                onClick={ () => props.setEditing(props.questionIndex) }
            />

            <BsFillTrashFill
                className={ classes.icon }
                onClick={ () => props.delete(props.questionIndex) }
            />

            { !props.isEditing && (
                <>
                    <BsArrowUp
                        className={ `${classes.icon} ${
                            props.questionIndex === 0 ? classes.disabled : ''
                        }` }
                        onClick={ () => props.move(props.questionIndex, -1) }
                    />

                    <BsArrowDown
                        className={ `${classes.icon} ${
                            props.numQuestions === props.questionIndex + 1
                                ? classes.disabled
                                : ''
                        }` }
                        onClick={ () => props.move(props.questionIndex, 1) }
                    />
                </>
            ) }

            <BsCopy
                className={ classes.icon }
                onClick={ () => props.copy(props.questionIndex) }
            />
        </div>
    );
}
