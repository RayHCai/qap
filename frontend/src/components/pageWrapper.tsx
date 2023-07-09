import { Outlet } from 'react-router';

import Nav from './nav';

export default function PageWrapper() {
    return (
        <>
            <Nav />

            <Outlet />
        </>
    );
}
