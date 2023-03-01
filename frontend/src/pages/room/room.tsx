import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Loading from '../../components/loading/loading';
import Question from '../../components/question/question';

import { SERVER_URL } from '../../settings';

import './room.css';

export default function Room() {
    const { code } = useParams();

    const [questions, updateQuestions] = useState([] as Question[]);
    const [isLoading, updateLoadingState] = useState(false);

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

    if(isLoading) return <Loading />;

    return (
        <div className="room-container">
            <div className="questions">
                {
                    questions.filter(
                        q => q.visible
                    ).map(
                        (q, i) => <Question title={ q.title } content={ q.content } key={ i } />
                    )
                }
            </div>
        </div>
    );
}
