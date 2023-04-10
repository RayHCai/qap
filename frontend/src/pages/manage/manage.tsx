import { useContext } from 'react';
import { Link } from 'react-router-dom';

import { TeacherContext } from '../../contexts/teacherContext';

import './manage.css';

export default function Manage() {
    const { user } = useContext(TeacherContext);

    return (
        <div className="manage-container">
            <h1>Manage Class </h1>

            <div>
                <Link className="manage-link" to="responses">View Student Responses</Link>
                <Link className="manage-link" to="edit">Or Edit Questions</Link>
            </div>
        </div>
    );
}
