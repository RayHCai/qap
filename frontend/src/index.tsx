import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import PrivateRoute from './components/privateRoute';
import StudentRoute from './components/studentRoute';

import JoinRoom from './pages/joinRoom/joinRoom';
import Room from './pages/room/room';
import Manage from './pages/manage/manage';
import PageNotFound from './pages/pageNotFound/pageNotFound';
import CreateOrManageRoom from './pages/createOrManageRoom/createOrManageRoom';
import EditQuestions from './pages/editQuestions/editQuestions';
import Responses from './pages/responses/responses';

import Loading from './components/loading/loading';

import { UserContext } from './contexts/userContext';

import { SERVER_URL } from './settings';

import './main.css';

function App() {
  const [name, updateName] = useState(null as string | null);
  const [code, updateCode] = useState(localStorage.getItem('classCode') as string | null);
  const [isLoading, updateLoading] = useState(false);

  useEffect(() => {
    if(!code) return;

    updateLoading(true);

    (async function() {
      const res = await fetch(`${ SERVER_URL }/classes/${ code }`);
      
      if(!res.ok) {
        updateCode(null);

        localStorage.removeItem('classCode');
      }

      updateLoading(false);
    })();
  }, [code]);

  function setCode(c: string | null) {
    if(c) localStorage.setItem('classCode', c);
    else localStorage.removeItem('classCode');

    updateCode(c);
  }

  if(isLoading) return <Loading />;

  return (
    <UserContext.Provider value={ { code, setCode, name, updateName } }>
      <BrowserRouter>
        <Routes>
          <Route index element={ <JoinRoom /> } />
          <Route path="/create-or-manage" element={ <CreateOrManageRoom /> } />

          <Route path="/room/:code" element={ <StudentRoute /> }>
            <Route index element={ <Room /> } />
          </Route>

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
