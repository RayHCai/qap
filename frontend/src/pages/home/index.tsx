import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';

import Button from '@/components/ui/button';
import Footer from '@/components/footer';

import StudentLoginModal from '@/components/ui/modal/login/student';
import TeacherLoginModal from '@/components/ui/modal/login/teacher';

import { UserContext } from '@/contexts/userContext';
import { ModalContext } from '@/contexts/modalContext';

import classes from './styles.module.css';

export default function Home() {
    const navigate = useNavigate();

    const { user } = useContext(UserContext);
    const { openModal, closeModal } = useContext(ModalContext);

    const [modalIndex, updateModalIndex] = useState(-1);

    function onClose() {
        closeModal(modalIndex);

        updateModalIndex(-1);
    }

    function openTeacherLoginModal() {
        const index = openModal(<TeacherLoginModal onClose={ onClose } />);
        updateModalIndex(index);
    }

    function openStudentLoginModal() {
        const index = openModal(<StudentLoginModal onClose={ onClose } />);
        updateModalIndex(index);
    }

    return (
        <>
            <div className={ classes.container }>
                <div className={ classes.contentContainer }>
                    <div className={ classes.introContainer }>
                        <h1>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit.
                        </h1>

                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Odit, optio exercitationem. Rem eius eligendi
                            dolores omnis commodi tempore, cum dolor.
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
                                    className={ `${classes.loginButton} ${classes.teacherLogin}` }
                                >
                                    Teacher Login
                                </Button>

                                <Button
                                    onClick={ openStudentLoginModal }
                                    className={ `${classes.loginButton} ${classes.studentLogin}` }
                                    light={ true }
                                >
                                    Student Login
                                </Button>
                            </div>
                        ) }
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
