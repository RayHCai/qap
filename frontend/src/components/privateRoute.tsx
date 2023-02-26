import { useContext } from 'react';
import { Outlet, Navigate } from 'react-router';

import { UserContext } from '../contexts/userContext';

export default function PrivateRoute() {
    const { code } = useContext(UserContext);

    if(code) return <Outlet />

    return <Navigate to="/create-or-manage" />;
}
