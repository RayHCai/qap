import MDEditor from '@uiw/react-md-editor';

import { EditorQuizQuestionProps } from '..';
import Button from '@/components/ui/button';

import classes from './styles.module.css';

export default function QuestionListItem(props: EditorQuizQuestionProps) {
    return (
        <div className={ classes.container }>
            <div className={ classes.header }>
                <h2>{ props.questionIndex + 1 }.</h2>

                <div className={ classes.markdownContainer }>
                    <MDEditor.Markdown
                        source={ props.question.content }
                        style={ {
                            padding: '10px',
                            borderRadius: '5px',
                            background: 'none',
                        } }
                    />
                </div>
            </div>

            { props.question.questionType === QuestionType.MC &&
                props.question.choices.map((choice, index) => (
                    <div
                        key={ index }
                        className={ `${classes.choice} ${
                            props.question.correctAnswers?.includes(choice)
                                ? classes.correct
                                : ''
                        }` }
                    >
                        <h3>{ index + 1 }.</h3>

                        <div className={ classes.markdownContainer }>
                            <MDEditor.Markdown
                                source={ choice }
                                style={ {
                                    padding: '10px',
                                    borderRadius: '5px',
                                    background: 'none',
                                } }
                            />
                        </div>
                    </div>
                )) }

            { props.question.questionType === QuestionType.TF && (
                <div className={ classes.choice }>
                    { props.question.correctAnswers?.includes('True') ? (
                        <Button className={ classes.true }>True</Button>
                    ) : (
                        <Button className={ classes.false }>False</Button>
                    ) }
                </div>
            ) }
        </div>
    );
}
