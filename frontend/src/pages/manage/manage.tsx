import { useContext } from 'react';
import { Link } from 'react-router-dom';

import { UserContext } from '../../contexts/userContext';

import './manage.css';

export default function Manage() {
    const { code } = useContext(UserContext);

    return (
        <div className="manage-container">
            <h1>Manage Class { code }</h1>

            <div>
                <Link className="manage-link" to="responses">View Student Responses</Link>
                <Link className="manage-link" to="edit">Or Edit Questions</Link>
            </div>
        </div>
    );
}
