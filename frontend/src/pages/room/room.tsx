import { useEffect, useState, useContext } from 'react';
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

    useEffect(() => {
        updateLoadingState(true);

        (async function() {
            const res = await fetch(`${ SERVER_URL }/questions/${ code }`);
            const json = await res.json();

            if(!res.ok) alert(json.message);
            else {
                updateQuestions(json.data);
                updateLoadingState(false);
            }
        })();
    }, []);

    async function submit() {

    }

    if(isLoading) return <Loading />;

    return (
        <div className="room-container">
            <div className="questions">
                {
                    questions.length > curPage ? <Question question={ questions[curPage] } /> : <></>
                }

                <div className="room-btn-container">
                    {
                        curPage === questions.length - 1 ? <button onClick={ submit }>Submit</button> 
                        : <button onClick={ () => updateCurPage(curPage + 1) }>Next Question</button>
                    }
                </div>
            </div>
        </div>
    );
}
