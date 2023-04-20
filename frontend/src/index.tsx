import { useState, useEffect, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import TeacherRoute from './components/teacherRoute';
import StudentRoute from './components/studentRoute';
import PageWrapper from './components/pageWrapper';

import { ErrorModal, ConfirmModal } from './components/modal/modal';
import Loading from './components/loading/loading';

import JoinRoom from './pages/joinRoom/joinRoom';
import Room from './pages/room/room';

import LoginOrSignup from './pages/loginOrSignup/loginOrSignup';
import Dashboard from './pages/dashboard/dashboard';
import CreateQuiz from './pages/createQuiz/createQuiz';
import EditQuiz from './pages/editQuiz/editQuiz';
import SessionDashboard from './pages/sessionDashboard/sessionDashboard';

import PageNotFound from './pages/pageNotFound/pageNotFound';

import { TeacherContext } from './contexts/teacherContext';
import { StudentContext } from './contexts/studentContext';
import { ErrorContext, Error } from './contexts/errorContext';

import { SERVER_URL } from './settings';

import './index.css';

function App() {
    const [name, updateName] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(
        localStorage.getItem('user')
            ? JSON.parse(localStorage.getItem('user')!)
            : null
    );

    const [errors, updateErrors] = useState<Error[]>([]);
    const errorModals: ReactNode[] = [];

    const [isLoading, updateLoading] = useState(false);

    useEffect(() => {
        if (!user) return;

        updateLoading(true);

        (async function () {
            const res = await fetch(`${ SERVER_URL }/users/manage/${ user.id }`);

            if (!res.ok) {
                setUser(null);

                localStorage.removeItem('user');
            }

            updateLoading(false);
        })();
    }, []);

    function updateUser(newUser: User | null) {
        if (newUser) localStorage.setItem('user', JSON.stringify(newUser));
        else localStorage.removeItem('user');

        setUser(newUser);
    }

    function throwError(title: string, description?: string, isConfirm: boolean = false, callback?: (c: boolean) => void) {
        if(
            errors.filter(
                e => e.title === title
            ).length !== 0
        ) return;

        const newErrors = [...errors];
            
        newErrors.push(
            {
                title: title,
                description: description,
                isConfirm: isConfirm,
                callback: callback
            }
        );

        updateErrors(newErrors);
    }

    function throwConfirm(title: string, callback: (c: boolean) => void, description?: string) {
        throwError(title, description, true, callback);
    }

    function closeModal(index: number) {
        const newErrors = [...errors].filter(
            (_, i) => i !== index
        );
                
        updateErrors(newErrors);
    }

    errors.forEach(
        (e, i) => errorModals.push(!e.isConfirm ? (
            <ErrorModal key={ i } closeModal={ () => closeModal(i) }>
                <div className="error-content">
                    <h1>{ e.title }</h1>

                    {
                        e.description && <p>{ e.description }</p>
                    }
                </div>
            </ErrorModal>
        ) : (
            <ConfirmModal key={ i } setStatus={ (c: boolean) => { e.callback!(c); closeModal(i); } }>
                <div className="error-content">
                    <h1>{ e.title }</h1>

                    {
                        e.description && <p>{ e.description }</p>
                    }
                </div>
            </ConfirmModal>
        ))
    )

    if (isLoading) return <Loading />;

    return (
        <ErrorContext.Provider value={{ errors, throwError, throwConfirm }}>
            { errorModals }

            <TeacherContext.Provider value={{ user, updateUser }}>
                <StudentContext.Provider value={{ name, updateName }}>
                    <BrowserRouter>
                        <Routes>
                            <Route element={ <PageWrapper /> }>
                                <Route index element={ <JoinRoom /> } />

                                <Route
                                    path="/login"
                                    element={ <LoginOrSignup isLogin={ true } /> }
                                />

                                <Route
                                    path="/signup"
                                    element={ <LoginOrSignup isLogin={ false } /> }
                                />

                                <Route path="/dashboard" element={ <TeacherRoute /> }>
                                    <Route index element={ <Dashboard /> } />

                                    <Route path="create" element={ <CreateQuiz /> } />
                                    <Route path="edit/:quizId" element={ <EditQuiz /> } />

                                    <Route path="session/:sessionId" element={ <SessionDashboard /> } />
                                </Route>

                                <Route path="/room/:quizId/:sessionId" element={ <StudentRoute /> }>
                                    <Route index element={ <Room /> } />
                                </Route>

                                <Route path="*" element={ <PageNotFound /> } />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </StudentContext.Provider>
            </TeacherContext.Provider>
        </ErrorContext.Provider>
    );
}

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(<App />);
