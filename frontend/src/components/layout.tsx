import { Outlet } from 'react-router';

import Nav from '@/components/nav';

import ModalContextWrapper from '@/contexts/modalContext';
import UserContextWrapper from '@/contexts/userContext';

export default function Layout() {
    return (
        <UserContextWrapper>
            <ModalContextWrapper>
                <Nav />

                <Outlet />
            </ModalContextWrapper>
        </UserContextWrapper>
    );
}
