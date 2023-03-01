import { useRef, useContext } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

import { UserContext } from '../../contexts/userContext';

import { SERVER_URL } from '../../settings';

import './joinRoom.css';

export default function JoinRoom() {
    const navigate = useNavigate();
    const { updateName } = useContext(UserContext);

    const name = useRef({} as HTMLInputElement);
    const code = useRef({} as HTMLInputElement);

    async function joinRoom() {
        if(name.current.value.replaceAll(' ', '').length === 0 || code.current.value.replaceAll(' ', '').length === 0) {
            alert('Name and code cannot be empty');
            return;
        }
        
        const res = await fetch(`${ SERVER_URL }/classes/${ code.current.value }/`);

        const json = await res.json();

        if(!res.ok) alert(json.message);
        else {
            updateName(name.current.value);
            navigate(`/room/${ code.current.value }`);
        }
    }

    return (
        <div className="join-room-container">
            <h1>Join Room</h1>

            <input placeholder="Enter Name" ref={ name } />
            <input placeholder="Enter Room Code" ref={ code } />

            <button onClick={ joinRoom }>Join</button>

            <Link className="animated-link" to="/create-or-manage">Or if you're a teacher, manage/create a room</Link>
        </div>
    );
}
