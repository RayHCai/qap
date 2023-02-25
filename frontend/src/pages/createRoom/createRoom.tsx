import { useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router';

import Loading from '../../components/loading';
import { SERVER_URL } from '../../settings';

import { UserContext } from '../../contexts/userContext';

import './createRoom.css';

export default function CreateRoom() {
    const { setCode } = useContext(UserContext);
    const navigate = useNavigate();

    const code = useRef({} as HTMLInputElement);
    const password = useRef({} as HTMLInputElement);

    const [isLoading, updateLoading] = useState(false);

    async function createRoom() {
        const c = code.current.value;
        if(c.replaceAll(' ', '').length === 0 || password.current.value.replaceAll(' ', '').length === 0) {
            alert('Please enter a room code and password.');

            return;
        }
        else if(c.length > 255) {
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
                    code: c,
                    password: password.current.value
                }
            )
        });

        if(!res.ok) {
            alert(res.statusText);

            updateLoading(false);
        }
        else {
            setCode(c);

            navigate('/manage');
        }
    }

    if(isLoading) return <Loading />;

    return (
        <div className="create-room-container">
            <h1>Create Room</h1>

            <input ref={ code } placeholder="Class Code..." type="text" />
            <input ref={ password } placeholder="Teacher Password..." type="password" />

            <button onClick={ createRoom }>Create</button>
        </div>
    );
}
