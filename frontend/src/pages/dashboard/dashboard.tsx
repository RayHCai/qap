import { useState, useEffect, useContext, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { BsArrowRight } from 'react-icons/bs';

import QuizCard from '../../components/quizCard/quizCard';
import Loading from '../../components/loading/loading';

import { TeacherContext } from '../../contexts/teacherContext';
import { ErrorContext } from '../../contexts/errorContext';

import { SERVER_URL } from '../../settings';

import classes from './dashboard.module.css';

export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useContext(TeacherContext);
    const { throwError } = useContext(ErrorContext);

    const [filter, updateFilter] = useState('');

    const [quizzes, updateQuizzes] = useState<Quiz[]>([]);
    const [isLoading, updateLoading] = useState(false);

    const fetchQuizzes = useCallback(async function(): Promise<string | undefined> {
        updateLoading(true);

        const res = await fetch(`${ SERVER_URL }/quizzes/teacher/${ user!.id }/`);
        const json = await res.json();

        updateLoading(false);

        if(!res.ok) return json.message;

        updateQuizzes(json.data);
    }, []);

    useEffect(() => {
        (async function() {
            const res = await fetchQuizzes();

            if(res) return throwError(res);
        })();
    }, []);

    async function deleteQuiz(id: string) {
        const res = await fetch(`${ SERVER_URL }/quizzes/delete/${ id }/`, {
            method: 'POST'
        });
        
        const json = await res.json();

        if(!res.ok) throwError(json.message);
        
        await fetchQuizzes();
    }

    if(isLoading || !user) return <Loading />;

    return (
        <div className={ classes.dashboardContainer }>
            <div className={ classes.profileHeader }>
                <button onClick={ () => navigate('/dashboard/profile') } className={ classes.profileBtn + ' ' + classes.btn }>
                    <div>
                        <h3>{ user.username }</h3>
                        <p>{ user.email }</p>
                    </div>

                    <div className={ classes.iconContainer }>
                        <BsArrowRight />
                    </div>
                </button>

                <input
                    onChange={ (e) => updateFilter(e.target.value) }
                    type="text"
                    placeholder="Search for a quiz..."
                />

                <button onClick={ () => navigate('/dashboard/create') } className={ classes.createBtn + ' ' + classes.btn }>
                    <p>Create a class</p>

                    <div className={ classes.iconContainer }>
                        <BsArrowRight />
                    </div>
                </button>
            </div>
            
            <div className={ classes.noQuizzes }>
                {
                    quizzes.filter(
                        c => c.name.toLowerCase().includes(filter.toLowerCase())
                    ).length === 0 && (
                        <h1>
                            You don't have any quizzes! Go <Link className={ classes.noQuizzLink } to="/dashboard/create">here</Link> to create one.
                        </h1>
                    )
                }
            </div>

            <div className={ classes.classesContainer }>
                {
                    quizzes.filter(
                        c => c.name.toLowerCase().includes(filter.toLowerCase())
                    ).map(
                        (c, i) => <QuizCard key={ i } quiz={ c } deleteQuiz={ deleteQuiz } />
                    )
                }
            </div>
        </div>
    );
}
