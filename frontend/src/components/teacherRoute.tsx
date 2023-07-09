import { useContext } from 'react';
import { Outlet, Navigate } from 'react-router';

import { TeacherContext } from '../contexts/teacherContext';

export default function TeacherRoute() {
    const { user } = useContext(TeacherContext);

    if (user) return <Outlet />;

    return <Navigate to="/login" />;
}
