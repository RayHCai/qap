import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import PrivateRoute from './components/privateRoute';

import JoinRoom from './pages/joinRoom/joinRoom';
import Room from './pages/room/room';
import CreateRoom from './pages/createRoom/createRoom';
import Manage from './pages/manage/manage';

import { UserContext } from './contexts/userContext';

import './main.css';

function App() {
  const [code, setCode] = useState(null as string | null);

  return (
    <UserContext.Provider value={ { code, setCode } }>
      <BrowserRouter>
        <Routes>
          <Route index element={ <JoinRoom /> } />

          <Route path="/room/:roomName" element={ <Room /> } />
          <Route path="/create" element={ <CreateRoom /> } />

          <Route element={ <PrivateRoute /> } path="/manage">
            <Route index element={ <Manage /> } />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<App />);
