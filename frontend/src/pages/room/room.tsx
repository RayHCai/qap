import { useEffect, useState, useContext, useRef, createRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Loading from '../../components/loading/loading';
import Question from '../../components/question/question';

import { StudentContext } from '../../contexts/studentContext';
import { ErrorContext } from '../../contexts/errorContext';

import { SERVER_URL } from '../../settings';

import classes from './room.module.css';

export default function Room() {
    const navigate = useNavigate();
    const { quizId, sessionId } = useParams();

    const { throwError } = useContext(ErrorContext);
    const { name } = useContext(StudentContext);

    const [questions, updateQuestions] = useState<Question[]>([]);
    const [isLoading, updateLoading] = useState(false);

    const curAnswerRef = createRef<HTMLDivElement & HTMLTextAreaElement>();
    const [answers, updateAnswers] = useState<Answer[]>([]);
    const [curQuestion, updateCurQuestion] = useState(0);
    const [quiz, updateQuiz] = useState<Quiz>();

    useEffect(() => {
        (async function() {
            updateLoading(true);

            const res = await fetch(`${ SERVER_URL }/questions/manage/${ quizId }/`);
            const json = await res.json();

            updateLoading(false);

            if(!res.ok) return throwError(json.message);

            updateQuiz(json.data.quiz);
            updateQuestions(json.data.questions);
            updateAnswers(json.data.questions.map(
                (q: Question) => (
                    {
                        id: '',
                        studentName: name,
                        answerFor: q.id,
                        textAnswer: '',
                        selected: [],
                        correct: false,
                        dateAnswered: ''
                    }
                )
            ));
        })();
    }, []);

    function getAnswer() {
        const newAnswer = {
            id: '',
            studentName: name!,
            answerFor: questions[curQuestion].id,
            textAnswer: '',
            selected: [] as string[],
            correct: false,
            dateAnswered: ''
        };

        if(curAnswerRef.current!.value) newAnswer.textAnswer = curAnswerRef.current!.value;       
        else
            newAnswer.selected = Array.from(curAnswerRef.current!.querySelectorAll('input:checked')).map(
                (i) => (i as HTMLInputElement).value
            );
        
        return newAnswer;
    }

    function next() {
        const newAnswers = [...answers];

        newAnswers[curQuestion] = getAnswer();

        updateAnswers(newAnswers);
        updateCurQuestion(curQuestion + 1);
    }

    function back() {
        const newAnswers = [...answers];

        newAnswers[curQuestion] = getAnswer();

        updateAnswers(newAnswers);
        updateCurQuestion(curQuestion - 1);
    }

    async function submit() {
        const newAnswers = [...answers];
        newAnswers[curQuestion] = getAnswer();

        const promises = await Promise.all(newAnswers.map(
            a => fetch(`${ SERVER_URL }/answers/manage/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        answer_for: a.answerFor,
                        session_for: sessionId,
                        student_name: name,
                        text_answer: a.textAnswer,
                        selected: a.selected
                    }
                )
            })
        ));
        
        for(const p of promises) {
            const json = await p.json();

            if(!p.ok) throwError(json.message);
        }

        // TODO: add loading screen like socrative or show num right/wrong
        navigate('/');
    }

    if(isLoading || !quiz) return <Loading />;

    // TODO: Add nav at bottom to show all questions.

    return (
        <div className={ classes.roomContainer }>
            <h1 className={ classes.title }>{ quiz.name }</h1>

            <div className={ classes.questionContainer }>
                <Question question={ questions[curQuestion] } answer={ answers[curQuestion] } ref={ curAnswerRef } />
            </div>

            <div className={ classes.buttonContainer }>
                {
                    curQuestion === 0 ? null : <button onClick={ back }>Back</button>
                }
                
                {
                    curQuestion === questions.length - 1 ?
                    <button onClick={ submit }>Submit</button>
                    : <button onClick={ next }>Next</button>
                }
            </div>
        </div>
    );
}
