import { Outlet } from 'react-router';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

import UserContextWrapper from '@/contexts/userContext';
import ErrorContextWrapper from '@/contexts/errorContext';

export default function Layout() {
	return (
		<UserContextWrapper>
			<ErrorContextWrapper>
				<Navbar />

				<Outlet />

				<Footer />
			</ErrorContextWrapper>
		</UserContextWrapper>
	);
}
