import { useContext } from 'react';
import { Outlet, Navigate } from 'react-router';

import { UserContext } from '../contexts/userContext';

export default function StudentRoute() {
    const { name } = useContext(UserContext);

    if(name) return <Outlet />

    return <Navigate to="/" />;
}
