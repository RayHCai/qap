import { useContext } from 'react';
import { Outlet, Navigate } from 'react-router';

import { StudentContext } from '../contexts/studentContext';

export default function StudentRoute() {
    const { name } = useContext(StudentContext);

    if(name) return <Outlet />

    return <Navigate to="/" />;
}
