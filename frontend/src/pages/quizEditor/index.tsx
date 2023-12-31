import { useRef, useState } from 'react';

import {
    PiQuestionThin,
    PiCheckCircleThin,
    PiChatCircleTextThin,
} from 'react-icons/pi';

import EditorQuizQuestion from '@/components/quizes/editorQuizQuestion';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';

import classes from './styles.module.css';

export default function QuizEditor() {
    const quizName = useRef<HTMLInputElement>(null);
    
    const [questions, setQuestions] = useState<Question[]>([]);
    const [editingQuestion, updateEditingQuestion] = useState<number>(-1);

    async function saveQuiz() {}

    // #region Question Manipulation Functions
    
    function addQuestion(questionType: QuestionType) {
        const newQuestion: Question = {
            id: '',
            title: '',
            content: '',
            questionFor: '',
            questionType: questionType,
            numPoints: 1,
            choices: (
                questionType === QuestionType.MC ? (new Array(4)).fill('') : []
            ),
            correctAnswer: ['True'],
        };

        updateEditingQuestion(questions.length);
        setQuestions([...questions, newQuestion]);
    }

    function saveQuestion(questionIndex: number, question: Question) {
        const newQuestions = [...questions];
        newQuestions[questionIndex] = question;

        setQuestions(newQuestions);
        updateEditingQuestion(-1); 
    }

    function deleteQuestion(questionIndex: number) {
        const newQuestions = [...questions];
        newQuestions.splice(questionIndex, 1);

        setQuestions(newQuestions);
        updateEditingQuestion(-1);
    }

    function moveQuestion(questionIndex: number, dir: number) {
        const newQuestions = [...questions];
        const temp = newQuestions[questionIndex];

        newQuestions[questionIndex] = newQuestions[questionIndex + dir];
        newQuestions[questionIndex + dir] = temp;

        setQuestions(newQuestions);
        updateEditingQuestion(questionIndex + dir);
    }

    function copyQuestion(questionIndex: number) {
        const newQuestions = [...questions];
        const newQuestion = newQuestions[questionIndex];

        newQuestions.splice(questionIndex, 0, newQuestion);

        setQuestions(newQuestions);
        updateEditingQuestion(questionIndex);
    }

    // #endregion

    return (
        <div className={ classes.container }>
            <div className={ classes.header }>
                <Input ref={ quizName } placeholder="Quiz name" type="text" />

                <Button onClick={ saveQuiz } light={ true }>Save and exit</Button>
            </div>

            <div className={ classes.quizEditor }>
                <div className={ classes.questions }>

                </div>
                {
                    questions.map(
                        (question, index) => (
                            <EditorQuizQuestion
                                key={ index }
                                questionIndex={ index }
                                numQuestions={ questions.length }
                                question={ question }
                                isEditing={ index === editingQuestion }
                                
                                setEditing={ updateEditingQuestion }
                                save={ saveQuestion }
                                delete={ deleteQuestion }
                                move={ moveQuestion }
                                copy={ copyQuestion }
                            />
                        )
                    )
                }

                {
                    questions.length === 0 && <h1>Add a question to get started!</h1>
                }

                <div className={ classes.addQuestion }>
                    <div className={ classes.iconContainer } onClick={ () => addQuestion(QuestionType.MC) }>
                        <PiQuestionThin className={ classes.icon } />
                        <span>Multiple Choice</span>
                    </div>

                    <div className={ classes.iconContainer } onClick={ () => addQuestion(QuestionType.TF) }>
                        <PiCheckCircleThin className={ classes.icon } />
                        <span>True / False</span>
                    </div>

                    <div className={ classes.iconContainer } onClick={ () => addQuestion(QuestionType.SA) }>
                        <PiChatCircleTextThin className={ classes.icon } />
                        <span>Short Answer</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
