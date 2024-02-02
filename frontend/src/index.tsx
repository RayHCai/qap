import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// #region Pages
import Home from '@/pages/home';

import Quiz from '@/pages/quiz';

import Dashboard from '@/pages/dashboard';
import Library from '@/pages/library';
import LiveResults from '@/pages/liveResults';
import Launch from '@/pages/launch';
import Rooms from '@/pages/rooms';

import QuizEditor from '@/pages/quizEditor';
import CreateQuestion from '@/pages/createQuestion';
import CreateRoom from '@/pages/createRoom';

import PageNotFound from '@/pages/pageNotFound';
// #endregion

import StudentRoute from '@/components/studentRoute';
import TeacherRoute from '@/components/teacherRoute';
import Layout from '@/components/layout';

import '@/styles/global.css';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={ <Layout /> }>
                    <Route path="/" element={ <Home /> } />

                    <Route element={ <TeacherRoute /> }>
                        <Route path="/dashboard" element={ <Dashboard /> } />

                        <Route path="/library" element={ <Library /> } />
                        <Route path="/launch" element={ <Launch /> } />
                        <Route path="/rooms" element={ <Rooms /> } />
                        
                        <Route
                            path="/live-results/:sessionId"
                            element={ <LiveResults /> }
                        />

                        <Route path="/quiz-editor/:quizId?" element={ <QuizEditor /> } />
                        <Route
                            path="/create-question/:questionType"
                            element={ <CreateQuestion /> }
                        />
                        <Route path="/create-room" element={ <CreateRoom /> } />
                    </Route>

                    <Route element={ <StudentRoute /> }>
                        <Route path="/quiz/:sessionId" element={ <Quiz /> } />
                    </Route>

                    <Route path="*" element={ <PageNotFound /> } />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(<App />);
