import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router';

import { UserContext } from '@/contexts/userContext';
import { SERVER_URL } from '@/settings';

import classes from './styles.module.css';

export default function Library() {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const [quizzes, setQuizzes] = useState<Quiz[]>([]);

    useEffect(() => {
        (async function () {
            const response = await fetch(
                `${SERVER_URL}/quizzes/teacher/${(user as Teacher).id}/`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const data = await response.json();

            setQuizzes(data.data);
        })();
    }, []);

    return (
        <div className={ classes.container }>
            <h1>Quiz Library</h1>

            <div className={ classes.quizContainer }>
                {
                    quizzes.map(
                        quiz => (
                            <div
                                key={ quiz.id }
                                className={ classes.quiz }
                                onClick={ () => navigate(`/quiz-editor/${ quiz.id }`) }
                            >
                                <p>{ quiz.name }</p>
                            </div>
                        )
                    )
                }
            </div>
        </div>
    );
}
