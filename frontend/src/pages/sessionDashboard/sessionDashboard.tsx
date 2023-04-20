import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router';

import { ErrorContext } from '../../contexts/errorContext';

import Loading from '../../components/loading/loading';

import { SERVER_URL } from '../../settings';

import classes from './sessionDashboard.module.css';

export default function SessionDashboard() {
    const { sessionId } = useParams();
    const { throwError } = useContext(ErrorContext);

    const [answers, updateAnswers] = useState<{ [k: string]: Answer[] }[]>();
    const [isLoading, updateLoading] = useState(false);

    useEffect(() => {
        (async function() {
            updateLoading(true);

            const res = await fetch(`${ SERVER_URL }/answers/getfromsession/${ sessionId }/`);
            const json = await res.json();

            updateLoading(false);

            if(!res.ok) return throwError(json.message);
            
            const filteredAnswers: Answer[] = json.data;
            
            const keys = Array.from(new Set(filteredAnswers.map(answer => answer.studentName)));
            const compositeArray = keys.map(
                k => (
                    {
                        [k]: filteredAnswers.filter(a => a.studentName === k)
                    }
                )
            );

            updateAnswers(compositeArray);
        })();
    }, []);

    if(isLoading) return <Loading />;

    // TODO: need to display rows for evverything

    return (
        <div className={ classes.dashboardContainer }>
            <h1>{  }</h1>
        </div>
    );
}
