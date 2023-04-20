import { useRef, useContext } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

import { StudentContext } from '../../contexts/studentContext';
import { ErrorContext } from '../../contexts/errorContext';

import { SERVER_URL } from '../../settings';

import classes from './joinRoom.module.css';

export default function JoinRoom() {
    const navigate = useNavigate();
    const { updateName } = useContext(StudentContext);
    const { throwError } = useContext(ErrorContext);

    const name = useRef({} as HTMLInputElement);
    const code = useRef({} as HTMLInputElement);

    async function joinRoom() {
        const studentName = name.current.value;
        const sessionCode = code.current.value;

        if(studentName.replaceAll(' ', '').length === 0 || sessionCode.replaceAll(' ', '').length === 0) {
            throwError('Name and code cannot be empty');

            return;
        }
        else if(studentName.length > 255) {
            throwError('Name must be less than 255 characters');

            return;
        }
        
        const res = await fetch(`${ SERVER_URL }/sessions/join/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    student_name: studentName,
                    session_code: sessionCode
                }
            )
        });

        const json = await res.json();

        if(!res.ok) throwError(json.message);
        else if(json.data.completed) {}
        else {
            updateName(studentName);

            navigate(`/room/${ json.data.sessionFor }/${ json.data.id }`);
        }
    }

    return (
        <div className={ classes.joinRoomContainer }>
            <h1>Student Login</h1>

            <div className={ classes.inputContainer }>
                <input placeholder="Enter Name" ref={ name } />
                <input placeholder="Enter Room Code" ref={ code } />
            </div>

            <button className="styled-button" onClick={ joinRoom }>Join</button>

            <Link className="animated-link" to="/login">Or signin/signup here if you're a teacher</Link>
        </div>
    );
}
