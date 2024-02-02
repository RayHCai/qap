import { useContext } from 'react';
import { Outlet, Navigate } from 'react-router';

import { UserContext } from '@/contexts/userContext';

export default function TeacherRoute() {
    const { user } = useContext(UserContext);

    if (user && 'id' in user) return <Outlet />;

    return <Navigate to="/" />;
}
