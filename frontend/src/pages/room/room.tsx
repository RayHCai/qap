import { useEffect, useState, useContext, useRef, createRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Loading from '../../components/loading/loading';
import Question from '../../components/question/question';

import { StudentContext } from '../../contexts/studentContext';
import { ErrorContext } from '../../contexts/errorContext';

import { SERVER_URL } from '../../settings';

import classes from './room.module.css';

export default function Room() {
    const { quizId } = useParams();
    const { throwError, throwConfirm } = useContext(ErrorContext);
    const { name } = useContext(StudentContext);

    const [questions, updateQuestions] = useState<Question[]>([]);
    const [isLoading, updateLoading] = useState(false);

    const curAnswerRef = useRef<HTMLDivElement & HTMLTextAreaElement>();
    const [answers, updateAnswers] = useState<Answer[]>([]);

    useEffect(() => {
        (async function() {
            updateLoading(true);

            const res = await fetch(`${ SERVER_URL }/questions/manage/${ quizId }/`);
            const json = await res.json();

            updateLoading(false);

            if(!res.ok) return throwError(json.message);
            
            updateQuestions(json.data);
            updateAnswers(json.data.map(
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

    if(isLoading) return <Loading />;

    return (
        <div className={ classes.roomContainer }>
            {
                questions.map(
                    (q, i) => <Question key={ i } question={ q } answer={ answers[i] } ref={ curAnswerRef } />
                )
            }
        </div>
    );

    /*
    // const navigate = useNavigate();
    // const { sessionCode } = useParams();

    // const { name } = useContext(StudentContext);
    // const { throwError } = useContext(ErrorContext);

    // const [questions, updateQuestions] = useState<Question[]>([]);
    // const [isLoading, updateLoadingState] = useState(false);

    // const [curPage, updateCurPage] = useState(0);

    // const answer = createRef<HTMLDivElement & HTMLTextAreaElement>();

    // const [answers, updateAnswers] = useState<Answer[]>([]);

    // useEffect(() => {
    //     updateLoadingState(true);

    //     (async function() {
    //         const res = await fetch(`${ SERVER_URL }/sessions/${ sessionCode }/`);
    //         const json = await res.json();

    //         if(!res.ok) alert(json.message);
    //         else {
    //             const classId = json.data.session_for;

    //             const questionsRes = await fetch(`${ SERVER_URL }/questions/${ classId }/`)
    //             const questionsJson = await questionsRes.json();

    //             console.log('Questions looks like this: ', questionsJson.data);

    //             updateQuestions(questionsJson.data);

    //             updateAnswers(
    //                 (new Array(questionsJson.data.length)).fill({}).map((_, index) => (
    //                     {
    //                         id: '',
    //                         studentName: '',
    //                         answerFor: '',
    //                         textAnswer: '',
    //                         selected: [],
    //                         correct: false,
    //                         dateAnswered: ''
    //                     }
    //                 ))
    //             );
                
    //             updateLoadingState(false);
    //         }
    //     })();
    // }, []);

    // function getAnswer() {
    //     if(answer.current!.value) { // if its a text area
    //         const newAnswers = [...answers];

    //         const curQuestion = questions[curPage];

    //         newAnswers[curPage].answerFor = curQuestion.id;
    //         newAnswers[curPage].textAnswer = answer.current!.value;

    //         updateAnswers(newAnswers);

    //         return newAnswers;
    //     }
    //     else {
    //         const newAnswers = [...answers];

    //         const curAnswer = newAnswers[curPage];
    //         const curQuestion = questions[curPage];

    //         for(const c of Array.from(answer.current!.children)) {
    //             const inpElement = c.children[0] as HTMLInputElement;

    //             if(!inpElement.checked) continue;

    //             curAnswer.answerFor = curQuestion.id;
    //             curAnswer.selected!.push(inpElement.value);

    //             if(inpElement.type === 'radio') break;
    //         }

    //         newAnswers[curPage] = curAnswer;

    //         updateAnswers(newAnswers);

    //         return newAnswers;
    //     }
    // }

    // function nextQuestion() {
    //     getAnswer();
    //     updateCurPage(curPage + 1);
    // }

    // async function submit() {
    //     const newAnswers = getAnswer();

    //     const unanswered = newAnswers.filter(
    //         (a, i) => (
    //             questions[i].required && (
    //                 questions[i].choices.length === 0 ? a.textAnswer!.replaceAll(' ', '').length === 0 : a.selected!.length === 0
    //             )
    //         )
    //     );

    //     if(unanswered.length !== 0) {
    //         const missedQuestions = newAnswers.map(
    //             (a, i) => unanswered.filter(a => a.answerFor === a.answerFor).length !== 0 ? i : -1
    //         ).filter(i => i !== -1);

    //         throwError(`Questions: ${ missedQuestions.join(', ') }`);

    //         return;
    //     }

    //     const res = await Promise.all(
    //         questions.map(
    //             async (q, i) => {
    //                 const answer = newAnswers[i];

    //                 return await fetch(`${ SERVER_URL }/answers/`, {
    //                     method: 'POST',
    //                     headers: {
    //                         'Content-Type': 'application/json'
    //                     },
    //                     body: JSON.stringify(
    //                         {
    //                             answer_for: q.id,
    //                             student_name: name,
    //                             selected: answer.selected,
    //                             text_answer: answer.textAnswer
    //                         }
    //                     )
    //                 });
    //             }
    //         )
    //     );

    //     for(const r of res) {
    //         const json = await r.json();

    //         if(!r.ok) {
    //             throwError(json.message);
             
    //             continue;
    //         }
    //         else {
    //             console.log('Answer json ', json);
    //         }
    //     }
    // }

    // if(isLoading) return <Loading />;

    // return (
    //     <div className="room-container">
    //         <div className="questions">
    //             {
    //                 questions.filter(
    //                     (_, i) => i === curPage
    //                 ).map(
    //                     (q, i) => <Question key={ q.id } question={ q } ref={ answer } answer={ answers[i] } />
    //                 )
    //             }

    //             <div className="room-btns-container">
    //                 <div className="room-btns-back-and-submit">
    //                     {
    //                         curPage > 0 ? <button onClick={ () => {
    //                             getAnswer();
    //                             updateCurPage(curPage - 1);
    //                         } }>Back</button> : <></>
    //                     }

    //                     {
    //                         curPage === questions.length - 1 
    //                         ? <button onClick={ submit }>Submit</button>
    //                         : <button onClick={ nextQuestion }>Next Question</button>
    //                     }
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // );

    return <></>;
    */
}
