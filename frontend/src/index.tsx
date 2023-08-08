import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import PageNotFound from '@/pages/404';
import Home from '@/pages/home';
import Dashboard from '@/pages/dashboard';
import Rooms from '@/pages/rooms';

import Layout from '@/components/layout';
import TeacherRoute from '@/components/teacherRoute';

import '@/styles/global.css';

function App() {    
    return (
        <BrowserRouter>
            <Routes>
                <Route>
                    <Route element={ <Layout />}>
                        <Route path="/" element={ <Home /> } />
                        
                        <Route
                            path="/dashboard"
                            element={ <Dashboard /> }
                        />

                        <Route
                            path="/rooms"
                            element={ <Rooms /> }
                        />

                        <Route element={ <TeacherRoute /> }>
                        </Route>

                        <Route path="*" element={ <PageNotFound /> } />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
    <App />
);
