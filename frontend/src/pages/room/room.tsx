import { useEffect, useState, useContext, createRef } from 'react';
import { useParams } from 'react-router-dom';

import Loading from '../../components/loading/loading';
import Question from '../../components/question/question';

import { UserContext } from '../../contexts/userContext';

import { SERVER_URL } from '../../settings';

import './room.css';

export default function Room() {
    const { name } = useContext(UserContext);
    const { code } = useParams();

    const [questions, updateQuestions] = useState([] as Question[]);
    const [isLoading, updateLoadingState] = useState(false);

    const [curPage, updateCurPage] = useState(0);

    const answer = createRef<HTMLFormElement & HTMLTextAreaElement>();

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
        if(answer.current!.value) console.log(answer.current!.value);
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

            console.log(curAnswer);
        }
    }

    function nextQuestion() {
        getAnswer();
        updateCurPage(curPage + 1);
    }

    async function submit() {
        getAnswer();
        // const res = await fetch(`${ SERVER_URL }/answers/`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(
        //         {
        //             question_id: 
        //         }
        //     )
        // });
    }

    if(isLoading) return <Loading />;

    return (
        <div className="room-container">
            <div className="questions">
                {
                    questions.length > curPage ? <Question question={ questions[curPage] } ref={ answer } answers={ answers } curQ={ curPage } /> : <></>
                }

                <div className="room-btns-container">
                    {
                        curPage === questions.length - 1 
                        ? (
                            <div className="room-btns-back-and-submit">
                                <button onClick={ () => updateCurPage(curPage - 1) }>Back</button>
                                <button onClick={ submit }>Submit</button>
                            </div>
                        ) 
                        : <button onClick={ nextQuestion }>Next Question</button>
                    }
                </div>
            </div>
        </div>
    );
}
