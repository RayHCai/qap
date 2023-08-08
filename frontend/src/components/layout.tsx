import { Outlet } from 'react-router';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

import UserContextWrapper from '@/contexts/userContext';
import ModalContextWrapper from '@/contexts/modalContext';

export default function Layout() {
    return (
        <UserContextWrapper>
            <ModalContextWrapper>
                <Navbar />
                <Outlet />
                <Footer />
            </ModalContextWrapper>
        </UserContextWrapper>
    );
}
