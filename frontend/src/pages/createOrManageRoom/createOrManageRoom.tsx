import { useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

import { UserContext } from '../../contexts/userContext';

import Loading from '../../components/loading/loading';

import { SERVER_URL } from '../../settings';

import classes from './createOrManageRoom.module.css';

export default function CreateOrManageRoom() {
    const navigate = useNavigate();
    const { setCode } = useContext(UserContext);

    const createRoomCode = useRef({} as HTMLInputElement);
    const createPassword = useRef({} as HTMLInputElement);

    const manageRoomCode = useRef({} as HTMLInputElement);
    const managePassword = useRef({} as HTMLInputElement);

    const [isLoading, updateLoading] = useState(false);

    async function createRoom() {
        const code = createRoomCode.current.value;
        const password = createPassword.current.value;

        if(code.replaceAll(' ', '').length === 0 || password.replaceAll(' ', '').length === 0) {
            alert('Please enter a room code and password.');

            return;
        }
        else if(code.length > 255) {
            alert('Code must be less than 255 characters.');

            return;
        }

        updateLoading(true);

        const res = await fetch(`${ SERVER_URL }/classes/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    code: code,
                    password: password
                }
            )
        });

        const json = await res.json();

        if(!res.ok) {
            alert(json.message);

            updateLoading(false);
        }
        else {
            setCode(code);

            navigate('/manage');
        }
    }

    async function manageRoom() {
        const code = createRoomCode.current.value;
        const password = createPassword.current.value;

        if(code.replaceAll(' ', '').length === 0 || password.replaceAll(' ', '').length === 0) {
            alert('Please enter a room code and password.');

            return;
        }
        else if(code.length > 255) {
            alert('Code must be less than 255 characters.');

            return;
        }

        updateLoading(true);

        const res = await fetch(`${ SERVER_URL }/validate/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    code: code,
                    password: password
                }
            )
        });

        const json = await res.json();

        if(!res.ok) {
            alert(json.message);

            updateLoading(false);
        }
        else {
            setCode(code);

            navigate('/manage');
        }
    }

    if(isLoading) return <Loading />;

    return (
        <div className={ classes.contentContainer }>
            <div className="create-or-manage-container">
                <h1>Create Room</h1>

                <input ref={ createRoomCode } placeholder="Enter Room Code" type="text" />
                <input ref={ createPassword } placeholder="Enter Teacher Password" type="password" />

                <button onClick={ createRoom }>Create</button>
            </div>

            <div className="create-or-manage-container">
                <h1>Manage Room</h1>

                <input placeholder="Enter Room Code" ref={ manageRoomCode } />
                <input placeholder="Enter Teacher Password" type="password" ref={ managePassword } />

                <button onClick={ manageRoom }>Login</button>
            </div>

            <Link className="animated-link" to="/">Or if you're a student, join a room</Link>
        </div>
    );
}
