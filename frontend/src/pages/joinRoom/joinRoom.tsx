import { useRef } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

import { SERVER_URL } from '../../settings';

import './joinRoom.css';

export default function JoinRoom() {
    const navigate = useNavigate();

    const code = useRef({} as HTMLInputElement);

    function joinRoom() {
        (async function validateRoom() {
            const res = await fetch(`${ SERVER_URL }/classes/${ code.current.value }/`);

            if(!res.ok) alert('Room not found.');
            else navigate(`/room/${ code.current.value }`);
        })();
    }

    return (
        <div className="join-room-container">
            <h1>Join Room</h1>

            <input placeholder="Enter Room Code" ref={ code } />

            <button onClick={ joinRoom }>Join</button>

            <Link className="animated-link" to="/create-or-manage">Or if you're a teacher, manage/create a room</Link>
        </div>
    );
}
