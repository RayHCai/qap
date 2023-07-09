import { useState, useEffect, useContext, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { BsArrowRight } from 'react-icons/bs';

import QuizCard from '../../components/quizCard';
import Loading from '../../components/loading';

import { TeacherContext } from '../../contexts/teacherContext';
import { ErrorContext } from '../../contexts/errorContext';

import { SERVER_URL } from '../../settings';

import classes from './dashboard.module.css';

export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useContext(TeacherContext);
    const { throwError, throwConfirm } = useContext(ErrorContext);

    const [filter, updateFilter] = useState('');

    const [quizzes, updateQuizzes] = useState<Quiz[]>([]);

    const [sessions, updateSessions] = useState<Session[]>([]);

    const [isLoading, updateLoading] = useState(false);

    const fetchQuizzes = useCallback(async function (): Promise<
        string | Quiz[]
    > {
        updateLoading(true);

        const res = await fetch(`${ SERVER_URL }/quizzes/teacher/${ user!.id }/`);
        const json = await res.json();

        updateLoading(false);

        if (!res.ok) return json.message;

        updateQuizzes(json.data);

        return json.data;
    },
    []);

    const fetchSessions = useCallback(async function (quizzes: Quiz[]) {
        updateLoading(true);

        const promises = await Promise.all(
            quizzes.map((q) => fetch(`${ SERVER_URL }/sessions/all/${ q.id }/`))
        );

        const sessionObjs = [];

        for (const p of promises) {
            const json = await p.json();

            if (!p.ok) throwError(json.message);
            else sessionObjs.push(json.data.length > 0 ? json.data[0] : null);
        }

        updateLoading(false);

        updateSessions(sessionObjs.filter((s) => s));
    }, []);

    useEffect(() => {
        (async function () {
            const res = await fetchQuizzes();
            if (typeof res === 'string') return throwError(res);

            await fetchSessions(res);
        })();
    }, []);

    async function deleteQuiz(id: string) {
        throwConfirm(
            'Are you sure you want to delete this quiz?',
            async (isConfirmed: boolean) => {
                if (!isConfirmed) return;

                const res = await fetch(`${ SERVER_URL }/quizzes/delete/${ id }/`, {
                    method: 'POST',
                });

                const json = await res.json();

                if (!res.ok) throwError(json.message);

                await fetchQuizzes();
            },
            'This action cannot be undone.'
        );
    }

    async function stopSession(id: string) {
        updateLoading(true);

        const sessionId = sessions.find((s) => s.sessionFor === id)!.id;

        const res = await fetch(
            `${ SERVER_URL }/sessions/terminate/${ sessionId }/`,
            {
                method: 'POST',
            }
        );

        const json = await res.json();

        updateLoading(false);

        if (!res.ok) return throwError(json.message);

        await fetchSessions(quizzes);
    }

    async function startSession(id: string) {
        updateLoading(true);

        const res = await fetch(`${ SERVER_URL }/sessions/manage/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // eslint-disable-next-line camelcase
                session_for: id,
            }),
        });

        const json = await res.json();

        updateLoading(false);

        if (!res.ok) throwError(json.message);
        else {
            throwError(`Session started with code ${ json.data.code }`);

            await fetchSessions(quizzes);
        }
    }

    if (isLoading || !user) return <Loading />;

    return (
        <div className={ classes.dashboardContainer }>
            <div className={ classes.profileHeader }>
                <button
                    onClick={ () => navigate('/dashboard/profile') }
                    className={ classes.profileBtn + ' ' + classes.btn }
                >
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

                <button
                    onClick={ () => navigate('/dashboard/create') }
                    className={ classes.createBtn + ' ' + classes.btn }
                >
                    <p>Create a class</p>

                    <div className={ classes.iconContainer }>
                        <BsArrowRight />
                    </div>
                </button>
            </div>

            <div className={ classes.noQuizzes }>
                { quizzes.filter((c) =>
                    c.name.toLowerCase().includes(filter.toLowerCase())
                ).length === 0 && (
                    <h1>
                        You don't have any quizzes! Go{ ' ' }
                        <Link
                            className={ classes.noQuizzLink }
                            to="/dashboard/create"
                        >
                            here
                        </Link>{ ' ' }
                        to create one.
                    </h1>
                ) }
            </div>

            <div className={ classes.classesContainer }>
                { quizzes
                    .filter((q) =>
                        q.name.toLowerCase().includes(filter.toLowerCase())
                    )
                    .map((q, i) => (
                        <QuizCard
                            key={ i }
                            quiz={ q }
                            deleteQuiz={ deleteQuiz }
                            session={
                                sessions.filter((s) => s.sessionFor === q.id)[0]
                            }
                            startSession={ startSession }
                            stopSession={ stopSession }
                        />
                    )) }
            </div>
        </div>
    );
}
