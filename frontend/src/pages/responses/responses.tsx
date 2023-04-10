import { useContext, useEffect, useState } from 'react';

import Loading from '../../components/loading/loading';

import { TeacherContext } from '../../contexts/teacherContext';
import { SERVER_URL } from '../../settings';

import './responses.css';

export default function Responses() {
    const { user } = useContext(TeacherContext);

    const [isLoading, updateLoading] = useState(false);
    const [responses, udpateResponses] = useState<Answer[]>([]);

    const [page, updatePage] = useState(0);
    
    useEffect(() => {
        updateLoading(true);

        (async function() {
            // const res = await fetch(`${ SERVER_URL }/answers/${ code }/`);
            // const json = await res.json();

            // if(!res.ok) alert(json.data);
            // else udpateResponses(json.data);

            updateLoading(false);
        })();
    }, []);

    if(isLoading) return <Loading />;

    return (
        <div className="responses-container">
            {
                (function() {
                    if(responses.length === 0) return <h1>No Responses Found</h1>;

                    const res = Object.entries(responses)[page];
                    
                    return (
                        <div>
                            <h1>Responses for { res[0] }</h1>

                            {/* {
                                res[1].map(
                                    (r, i) => (
                                        <div key={ i }>
                                            <p>Student { r.name } answered: { r.answer.length === 0 ? r.choice : r.answer }</p>

                                            Answered at { r.date_answered }
                                        </div>
                                    )
                                )
                            } */}
                        </div>
                    );
                })()
            }

            <div className="responses-button-page-container">
                {
                    page > 0 ? <button onClick={ () => updatePage(page - 1) }>Previous Page</button> : <></>
                }

                {
                    page < Object.entries(responses).length - 1 ? <button onClick={ () => updatePage(page + 1) }>Next Page</button> : <></>
                }

                
            </div>
        </div>
    );
}
