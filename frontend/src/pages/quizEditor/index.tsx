import { useRef, useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router';

import {
    PiQuestionThin,
    PiCheckCircleThin,
    PiChatCircleTextThin,
} from 'react-icons/pi';

import EditorQuizQuestion from '@/components/quizes/editorQuizQuestion';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';

import { UserContext } from '@/contexts/userContext';
import useThrowError from '@/hooks/useThrowError';

import { SERVER_URL } from '@/settings';

import classes from './styles.module.css';

export default function QuizEditor() {
    const navigate = useNavigate();

    const { quizId } = useParams();

    const throwError = useThrowError();

    const { user } = useContext(UserContext);

    const quizName = useRef<HTMLInputElement>(null);

    const [questions, setQuestions] = useState<Question[]>([]);
    const [editingQuestion, updateEditingQuestion] = useState<number>(-1);

    const [originalQuestions, updateOriginalQuestions] = useState<Question[]>(
        []
    );

    const [quiz, updateQuiz] = useState<Quiz | null>(null);

    useEffect(() => {
        (async function () {
            if (!quizId) return;

            const res = await fetch(
                `${SERVER_URL}/questions/manage/${quizId}/`
            );
            const json = await res.json();

            if (!res.ok) return throwError(json.message);

            setQuestions(json.data.questions);
            updateOriginalQuestions(json.data.questions);

            updateQuiz(json.data.quiz);
        })();
    }, []);

    async function createQuiz() {
        const name = quizName.current!.value;

        if (name.replaceAll(' ', '').length !== name.length)
            return throwError('Name cannot contain spaces');
        else if (name.length === 0) return throwError('Name cannot be empty');      
        else if (name.length > 255)
            return throwError('Name cannot exceed 255 characters');

        const res = await fetch(`${SERVER_URL}/quizzes/manage/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // eslint-disable-next-line camelcase
                teacher_id: (user as Teacher).id,
                name: name,
            }),
        });

        const json = await res.json();

        if (!res.ok) return throwError(json.message);

        return json.data;
    }

    async function saveQuiz() {
        let quizId = quiz?.id;

        if (!quiz) {
            quizId = await createQuiz();

            if (!quizId) return;
        }

        const promisesArr = questions.map((q) =>
            q.id.length === 0
                ? fetch(`${SERVER_URL}/questions/manage/`, {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                          content: q.content,
                          // eslint-disable-next-line camelcase
                          question_for: quizId,
                          // eslint-disable-next-line camelcase
                          question_type: q.questionType,
                          // eslint-disable-next-line camelcase
                          num_points: q.numPoints, 
                          choices: q.choices,
                          // eslint-disable-next-line camelcase
                          correct_answers: q.correctAnswers,
                      }),
                  })
                : fetch(`${SERVER_URL}/questions/update/${q.id}/`, {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                          // eslint-disable-next-line camelcase
                          change_obj: {
                              content: q.content,
                              // eslint-disable-next-line camelcase
                              question_for: q.questionFor,
                              // eslint-disable-next-line camelcase
                              question_type: q.questionType,
                              // eslint-disable-next-line camelcase
                              num_points: q.numPoints,
                              choices: q.choices,
                              // eslint-disable-next-line camelcase
                              correct_answers: q.correctAnswers,
                          },
                      }),
                  })
        );

        for (const oQ of originalQuestions) {
            if (
                questions
                    .filter((q) => q.id.length > 0)
                    .filter((q) => q.id === oQ.id).length === 0
            ) {
                promisesArr.push(
                    fetch(`${SERVER_URL}/questions/delete/${oQ.id}/`, {
                        method: 'POST',
                    })
                );
            }
        }

        // TODO: update quiz name

        const promises = await Promise.all(promisesArr);

        let allSuccess = true;

        for (const p of promises) {
            const json = await p.json();

            if (!p.ok) {
                throwError(json.message);

                allSuccess = false;
            }
        }

        if (allSuccess) navigate('/dashboard');
    }

    // #region Question Manipulation Functions

    function addQuestion(questionType: QuestionType) {
        const newQuestion: Question = {
            id: '',
            content: '',
            questionFor: '',
            questionType: questionType,
            numPoints: 1,
            choices:
                questionType === QuestionType.MC ? new Array(4).fill('') : [],
            correctAnswers: questionType === QuestionType.TF ? ['True'] : [],
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
        if (questionIndex + dir < 0 || questionIndex + dir >= questions.length)
            return;

        const newQuestions = [...questions];
        const temp = newQuestions[questionIndex];

        newQuestions[questionIndex] = newQuestions[questionIndex + dir];
        newQuestions[questionIndex + dir] = temp;

        setQuestions(newQuestions);
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

                <Button onClick={ saveQuiz } light={ true }>
                    Save and exit
                </Button>
            </div>

            <div className={ classes.quizEditor }>
                <div className={ classes.questions }></div>
                { questions.map((question, index) => (
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
                )) }

                { questions.length === 0 && (
                    <h1>Add a question to get started!</h1>
                ) }

                <div className={ classes.addQuestion }>
                    <div
                        className={ classes.iconContainer }
                        onClick={ () => addQuestion(QuestionType.MC) }
                    >
                        <PiQuestionThin className={ classes.icon } />
                        <span>Multiple Choice</span>
                    </div>

                    <div
                        className={ classes.iconContainer }
                        onClick={ () => addQuestion(QuestionType.TF) }
                    >
                        <PiCheckCircleThin className={ classes.icon } />
                        <span>True / False</span>
                    </div>

                    <div
                        className={ classes.iconContainer }
                        onClick={ () => addQuestion(QuestionType.SA) }
                    >
                        <PiChatCircleTextThin className={ classes.icon } />
                        <span>Short Answer</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
