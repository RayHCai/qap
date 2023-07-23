import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ModalContextWrapper from '@/contexts/modalContext';

import PageNotFound from '@/pages/404';
import Home from '@/pages/home';

import Layout from '@/components/layout';

import '@/styles/global.css';

function App() {
    return (
        <ModalContextWrapper>
            <BrowserRouter>
                <Routes>
                    <Route element={ <Layout /> }>
                        <Route path="/" element={ <Home /> } />
                        
                        <Route path="*" element={ <PageNotFound /> } />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ModalContextWrapper>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
    <App />
);
