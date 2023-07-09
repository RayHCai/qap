import { useState, useContext, createRef } from 'react';
import { useNavigate } from 'react-router';

import Loading from '../../components/loading';

import { TeacherContext } from '../../contexts/teacherContext';
import { ErrorContext } from '../../contexts/errorContext';

import { SERVER_URL } from '../../settings';

import classes from './createQuiz.module.css';

export default function CreateQuiz() {
    const { user } = useContext(TeacherContext);
    const { throwError } = useContext(ErrorContext);

    const navigate = useNavigate();

    const name = createRef<HTMLInputElement>();

    const [isLoading, updateLoading] = useState(false);

    async function create() {
        const quizName = name.current!.value;

        if (quizName.replaceAll(' ', '').length !== quizName.length)
            return throwError('Name cannot contain spaces');
        else if (quizName.length === 0)
            return throwError('Name cannot be empty');
        else if (quizName.length > 255)
            return throwError('Name cannot exceed 255 characters');

        updateLoading(true);

        const res = await fetch(`${ SERVER_URL }/quizzes/manage/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // eslint-disable-next-line camelcase
                teacher_id: user!.id,
                name: quizName,
            }),
        });

        const json = await res.json();

        updateLoading(false);

        if (!res.ok) return throwError(json.message);

        navigate(`/dashboard/edit/${json.data}`);
    }

    if (isLoading) return <Loading />;

    return (
        <div className={ classes.createContainer }>
            <div className={ classes.content }>
                <h1>Create quiz</h1>

                <input ref={ name } type="text" placeholder="Quiz name" />

                <button onClick={ create }>Create</button>
            </div>
        </div>
    );
}
