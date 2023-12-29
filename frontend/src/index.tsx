import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// #region Pages

import Home from '@/pages/home';
import PageNotFound from '@/pages/pageNotFound';
import Dashboard from '@/pages/dashboard';
// import Rooms from '@/pages/rooms';
// import CreateQuiz from '@/pages/createQuiz';
// import CreateQuestion from '@/pages/createQuestion';
// import CreateRoom from '@/pages/createRoom';
// import Quiz from '@/pages/quiz';
// import LiveResults from '@/pages/liveResults';

// #endregion

import Layout from '@/components/layout';
import TeacherRoute from '@/components/teacherRoute';

import '@/styles/global.css';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={ <Layout /> }>
                    <Route path="/" element={ <Home /> } />

                    <Route element={ <TeacherRoute /> }>
                        <Route path="/dashboard" element={ <Dashboard /> } />
                    </Route>

                    <Route path="*" element={ <PageNotFound /> } />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(<App />);
