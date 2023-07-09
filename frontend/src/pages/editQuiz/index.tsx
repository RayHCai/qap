import { useEffect, useState, useContext, createRef, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';

import { BsArrowRight } from 'react-icons/bs';

import QuestionCard, { QuestionCardRef } from '../../components/questionCard';
import Loading from '../../components/loading';

import { ErrorContext } from '../../contexts/errorContext';

import { SERVER_URL } from '../../settings';

import { verifyQuestion } from '../../helpers/questionsHelpers';

import classes from './editQuiz.module.css';

// TODO: before user leaves the page see if there are unsaved changes

export default function EditQuiz() {
    const { quizId } = useParams();
    const navigate = useNavigate();

    const { throwError } = useContext(ErrorContext);

    const [originalQuestions, updateOriginalQuesitons] = useState<Question[]>(
        []
    );
    const [_originalQuiz, updateOriginalQuiz] = useState<Quiz>();

    const [questions, updateQuestions] = useState<Question[]>([]);
    const [quiz, updateQuiz] = useState<Quiz>();

    const [editingQuestion, updateEditingQuestion] = useState(-1);

    const [isLoading, updateLoading] = useState(false);

    const questionRefs = useRef<QuestionCardRef[]>([]);

    if (questionRefs.current.length !== questions.length) {
        questionRefs.current = Array.from(questionRefs.current).map(
            (_, i) => questionRefs.current[i] || createRef()
        );
    }

    useEffect(() => {
        (async function () {
            updateLoading(true);

            const res = await fetch(
                `${SERVER_URL}/questions/manage/${quizId}/`
            );
            const json = await res.json();

            updateLoading(false);

            if (!res.ok) return throwError(json.message);

            updateQuestions(json.data.questions);
            updateOriginalQuesitons(json.data.questions);

            updateQuiz(json.data.quiz);
            updateOriginalQuiz(json.data.quiz);
        })();
    }, []);

    async function saveQuiz() {
        const promisesArr = questions.map((q) =>
            q.id.length === 0
                ? fetch(`${SERVER_URL}/questions/manage/`, {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                          title: q.title,
                          content: q.content,
                          // eslint-disable-next-line camelcase
                          question_for: q.questionFor,
                          // eslint-disable-next-line camelcase
                          question_type: q.questionType,
                          // eslint-disable-next-line camelcase
                          num_points: q.numPoints,
                          choices: q.choices,
                          // eslint-disable-next-line camelcase
                          correct_answer: q.correctAnswer,
                      }),
                  })
                : fetch(`${ SERVER_URL }/questions/update/${ q.id }/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        // eslint-disable-next-line camelcase
                        change_obj: {
                            title: q.title,
                            content: q.content,
                            // eslint-disable-next-line camelcase
                            question_for: q.questionFor,
                            // eslint-disable-next-line camelcase
                            question_type: q.questionType,
                            // eslint-disable-next-line camelcase
                            num_points: q.numPoints,
                            choices: q.choices,
                            // eslint-disable-next-line camelcase
                            correct_answer: q.correctAnswer,
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
        // if(quiz!.name !== originalQuiz!.name)
        //     promisesArr.push(
        //         fetch(`${ SERVER_URL }/questions/`)
        //     );

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

    function resizeInput(e: React.ChangeEvent<HTMLInputElement>) {
        const newVal = e.target.value;

        if (newVal.length > 255) return;

        if (newVal.length < 100) e.target.style.width = `${newVal.length}ch`;

        updateQuiz({
            ...quiz!,
            name: newVal,
        });
    }

    function addQuestion(type: 'mc' | 'tf' | 'sa') {
        let questionsToCopy = [...questions];

        if (editingQuestion !== -1) {
            const updatedQ = createQuestionFromRef(editingQuestion);

            const title = updatedQ.title;
            const choices = updatedQ.choices;
            const content = updatedQ.content;

            // if the question is completely blank
            if (
                title.replaceAll(' ', '').length === 0 &&
                choices.length === 0 &&
                content.length === 0
            ) {
                questionsToCopy = questionsToCopy.filter(
                    (_, i) => i !== editingQuestion
                );
            }
 else if (verifyQuestion(updatedQ)) questionsToCopy.push(updatedQ);
            else
                return throwError(
                    'Question is not complete. Please make sure there is a title and at least two options for multiple choice questions'
                );
        }

        const newQuestion: Question = {
            id: '',
            title: '',
            content: '',
            questionFor: quizId!,
            choices: [] as string[],
            questionType: type,
            numPoints: 0,
        };

        if (type === 'mc') newQuestion.correctAnswer = [];
        else if (type === 'tf') newQuestion.choices = ['True', 'False'];

        updateEditingQuestion(questionsToCopy!.length);
        updateQuestions([...questionsToCopy, newQuestion]);
    }

    function deleteQuestion(i: number) {
        // TODO: make sure to confirm with user to delete question

        const newQuestions = [...questions].filter((_, ind) => ind !== i);

        updateQuestions(newQuestions);

        if (i === editingQuestion) updateEditingQuestion(-1);
    }

    function createQuestionFromRef(i: number) {
        const qObj = questionRefs.current[i];

        const question: Question = {
            id: '',
            title: qObj.title.value,
            content: qObj.content,
            questionFor: quizId!,
            choices: qObj.choices.map((c) => c.value),
            correctAnswer: qObj.choices
                .filter((c) => c.isCorrect)
                .map((c) => c.value),
            questionType: questions[i].questionType,
            numPoints: Number(qObj.points.value),
        };

        return question;
    }

    function saveQuestion(i: number) {
        const q = createQuestionFromRef(i);

        if (!verifyQuestion(q))
            return throwError(
                'Question is not complete. Please make sure there is a title and at least two options for multiple choice questions'
            );

        const newQuestions = [...questions];

        newQuestions[i] = q;

        updateQuestions(newQuestions);
        updateEditingQuestion(-1);
    }

    function editQuestion(i: number) {
        updateEditingQuestion(i);
    }

    // TODO: need to implement these

    function moveQuestion(_i: number, _dir: number) {}

    function copyQuestion(_i: number) {}

    if (isLoading || !quiz) return <Loading />;

    return (
        <div className={ classes.container }>
            <div className={ classes.header }>
                <input
                    placeholder="Quiz Title"
                    className={ classes.title }
                    value={ quiz.name }
                    onChange={ resizeInput }
                />

                <button>Fill with AI generated questions</button>
                <button>Fill with questions from other quizzes</button>

                <button onClick={ saveQuiz } className={ classes.saveBtn }>
                    <p>Save and Exit</p>

                    <div className={ classes.iconContainer }>
                        <BsArrowRight />
                    </div>
                </button>
            </div>

            <div className={ classes.questions }>
                { questions.length === 0 && (
                    <h1>You don't have any questions for this quiz!</h1>
                ) }

                { questions.map((q, i) => (
                    <QuestionCard
                        key={ i }
                        question={ q }
                        questionNumber={ i + 1 }
                        isEdit={ editingQuestion === i }
                        delete={ deleteQuestion }
                        save={ saveQuestion }
                        edit={ editQuestion }
                        move={ moveQuestion }
                        copy={ copyQuestion }
                        numQuestions={ questions.length }
                        ref={ (r: QuestionCardRef) =>
                            (questionRefs.current[i] = r)
                        }
                    />
                )) }
            </div>

            <div className={ classes.footer }>
                <p>Add a Question</p>

                <div className={ classes.questionTypes }>
                    <button onClick={ () => addQuestion('mc') }>
                        Multiple Choice
                    </button>

                    <button onClick={ () => addQuestion('tf') }>
                        True / False
                    </button>

                    <button onClick={ () => addQuestion('sa') }>
                        Short Answer
                    </button>
                </div>
            </div>
        </div>
    );
}
