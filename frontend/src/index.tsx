import { useState, useEffect, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { SERVER_URL } from './settings';

import './index.css';

function App() {
    return (
        <>
            <h1>Fortnite</h1>
        </>
        // <BrowserRouter>
        //     <Routes>

        //     </Routes>
        // </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(<App />);
