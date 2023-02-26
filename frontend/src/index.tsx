import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import PrivateRoute from './components/privateRoute';

import JoinRoom from './pages/joinRoom/joinRoom';
import Room from './pages/room/room';
import Manage from './pages/manage/manage';
import PageNotFound from './pages/pageNotFound/pageNotFound';
import CreateOrManageRoom from './pages/createOrManageRoom/createOrManageRoom';
import EditQuestions from './pages/editQuestions/editQuestions';
import Responses from './pages/responses/responses';

import { UserContext } from './contexts/userContext';

import './main.css';

function App() {
  const [code, setCode] = useState(null as string | null);

  return (
    <UserContext.Provider value={ { code, setCode } }>
      <BrowserRouter>
        <Routes>
          <Route index element={ <JoinRoom /> } />

          <Route path="/create-or-manage" element={ <CreateOrManageRoom /> } />

          <Route path="/room/:roomName" element={ <Room /> } />
          
          <Route path="/manage" element={ <PrivateRoute /> }>
            <Route index element={ <Manage /> } />

            <Route path="responses" element={ <Responses /> } />
            <Route path="edit" element={ <EditQuestions /> } />
          </Route>

          <Route path="*" element={ <PageNotFound /> } />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<App />);
