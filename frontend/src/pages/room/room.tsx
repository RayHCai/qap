import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Question from '../../components/question';

import { SERVER_URL } from '../../settings';

export default function Room() {
    const { roomName } = useParams();

    const [questions, updateQuestions] = useState([]);

    useEffect(function() {
        (async function() {
            // const res = await fetch(`${ SERVER_URL }/getQuestions?roomName=${}`);
        })();
    }, []);

    return (
        <>

        </>
    );
}