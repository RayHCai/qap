import { Outlet } from 'react-router';

import Nav from '@/components/nav';

import ModalContextWrapper from '@/contexts/modalContext';
import UserContextWrapper from '@/contexts/userContext';
import { RoomContextWrapper } from '@/contexts/roomContext';

export default function Layout() {
    return (
        <UserContextWrapper>
            <RoomContextWrapper>
                <ModalContextWrapper>
                    <Nav />

                    <Outlet />
                </ModalContextWrapper>
            </RoomContextWrapper>
        </UserContextWrapper>
    );
}
