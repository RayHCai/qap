import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';

import Button from '@/components/ui/button';
import StudentLoginModal from '@/components/loginModals/studentLoginModal';
import TeacherLoginModal from '@/components/loginModals/teacherLoginModal';

import { UserContext } from '@/contexts/userContext';

import classes from './styles.module.css';

export default function Home() {
	const navigate = useNavigate();

	const { user } = useContext(UserContext);

	const [curModal, updateCurModal] = useState<JSX.Element | null>(null);


	function openTeacherLoginModal() {
		updateCurModal(
			<TeacherLoginModal onClose={ () => updateCurModal(null) } />
		);
	}

	function openStudentLoginModal() {
		updateCurModal(
			<StudentLoginModal onClose={ () => updateCurModal(null) } />
		);
	}

	return (
		<>
			{ curModal }
			
			<div className={ classes.container }>
				<div className={ classes.contentContainer }>
					<div className={ classes.introContainer }>
						<h1>
							Lorem ipsum dolor sit amet consectetur adipisicing elit.
						</h1>

						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing elit.
							Odit, optio exercitationem. Rem eius eligendi dolores
							omnis commodi tempore, cum dolor.
						</p>
					</div>

					<div className={ classes.getStarted }>
						<h1>Get Started</h1>

						{ user ? (
							<div className={ classes.dashboardButtonContainer }>
								<Button
									onClick={ () => navigate('/dashboard') }
									className={ classes.loginButton }
								>
									Dashboard
								</Button>
							</div>
						) : (
							<div className={ classes.getStartedButtons }>
								<Button
									onClick={ openTeacherLoginModal }
									className={
										classes.loginButton +
										' ' +
										classes.teacherLogin
									}
								>
									Teacher Login
								</Button>

								<Button
									onClick={ openStudentLoginModal }
									className={
										classes.loginButton +
										' ' +
										classes.studentLogin
									}
								>
									Student Login
								</Button>
							</div>
						) }
					</div>
				</div>
			</div>
		</>
	);
}
