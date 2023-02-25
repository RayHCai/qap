import { useRef } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

import { SERVER_URL } from '../../settings';

import './joinRoom.css';

export default function JoinRoom() {
    const navigate = useNavigate();

    const roomInput = useRef({} as HTMLInputElement);

    function joinRoom() {
        (async function validateRoom() {
            const res = await fetch(`${ SERVER_URL }/classes/${ roomInput.current.value }/`);

            if(!res.ok) alert('Room not found.');
            else navigate(`/room/${ roomInput.current.value }`);
        })();
    }

    return (
        <div className="join-content-container">
            <div className="join-containers">
                <div className="join-room-container">
                    <h1>Enter Room Name</h1>

                    <input placeholder="Enter Room Code" ref={ roomInput } />

                    <button onClick={ joinRoom }>Join</button>
                </div>

                <div className="join-room-container">
                    <h1>Enter Room Name</h1>

                    <input placeholder="Enter Room Code" ref={ roomInput } />

                    <button onClick={ joinRoom }>Join</button>
                </div>
            </div>

            <Link to="/create" className="create">Or create a room</Link>
        </div>
    );
}
