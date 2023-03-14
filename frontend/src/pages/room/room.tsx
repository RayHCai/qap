import { useEffect, useState, useContext, createRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Loading from '../../components/loading/loading';
import Question from '../../components/question/question';

import { UserContext } from '../../contexts/userContext';

import { SERVER_URL } from '../../settings';

import './room.css';

export default function Room() {
    const { name } = useContext(UserContext);
    const { code } = useParams();

    const navigate = useNavigate();

    const [questions, updateQuestions] = useState([] as Question[]);
    const [isLoading, updateLoadingState] = useState(false);

    const [curPage, updateCurPage] = useState(0);

    const answer = createRef<HTMLDivElement & HTMLTextAreaElement>();

    const [answers, updateAnswers] = useState([] as Answer[]);

    useEffect(() => {
        updateLoadingState(true);

        (async function() {
            const res = await fetch(`${ SERVER_URL }/questions/${ code }`);
            const json = await res.json();

            if(!res.ok) alert(json.message);
            else {
                updateQuestions(json.data);
                updateAnswers((new Array(json.data.length)).fill({}).map((_, index) => (
                    {
                        question: index,
                        answer: ''
                    }
                )));
                
                updateLoadingState(false);
            }
        })();
    }, []);

    function getAnswer() {
        if(answer.current!.value) {
            const newAnswers = [...answers];

            newAnswers[curPage] = {
                question: curPage,
                answer: answer.current!.value
            };

            updateAnswers(newAnswers);

            return newAnswers;
        }
        else {
            const curAnswer = {} as Answer;

            for(const c of Array.from(answer.current!.children)) {
                const inpElement = c.children[0] as HTMLInputElement;

                if(!inpElement.checked) continue;

                if(inpElement.type === 'radio') {
                    curAnswer.answer = inpElement.value;
                    curAnswer.question = curPage;
                    
                    break;
                }
                else {
                    if(curAnswer.answer) curAnswer.answer += `,${ inpElement.value }`;
                    else curAnswer.answer = inpElement.value;

                    curAnswer.question = curPage;
                }
            }

            const newAnswers = [...answers];

            if(!curAnswer.answer) return newAnswers;

            newAnswers[curPage] = curAnswer;

            updateAnswers(newAnswers);

            return newAnswers;
        }
    }

    function nextQuestion() {
        getAnswer();
        updateCurPage(curPage + 1);
    }

    async function submit() {
        const newAnswers = getAnswer();

        if(newAnswers.filter(
            a => a.answer.replaceAll(' ', '').length === 0
        ).length !== 0) {
            alert('Need to answer all questions before submitting.');

            return;
        }

        const res = await Promise.all(
            questions.map(
                async (q, i) => {
                    const answer = newAnswers[i];

                    return await fetch(`${ SERVER_URL }/answers/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(
                            {
                                question_id: q.id,
                                name: name,
                                ...(
                                    q.choices ? {
                                        choice: answer.answer
                                    } : {
                                        answer: answer.answer
                                    }
                                )
                            }
                        )
                    });
                }
            )
        );

        for(const r of res) {
            if(!r.ok) {
                alert('Something went wrong.');
                
                return;
            }

            navigate('/');
        }
    }

    if(isLoading) return <Loading />;

    return (
        <div className="room-container">
            <div className="questions">
                {
                    questions.filter(
                        (_, i) => i === curPage
                    ).map(
                        (q, i) => <Question key={ q.id } question={ q } ref={ answer } answer={ answers.filter(a => a.question === curPage)[0] } />
                    )
                }

                <div className="room-btns-container">
                    <div className="room-btns-back-and-submit">
                        {
                            curPage > 0 ? <button onClick={ () => {
                                getAnswer();
                                updateCurPage(curPage - 1);
                            } }>Back</button> : <></>
                        }

                        {
                            curPage === questions.length - 1 
                            ? <button onClick={ submit }>Submit</button>
                            : <button onClick={ nextQuestion }>Next Question</button>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
