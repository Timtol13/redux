import './App.scss';
import { Routes, Route, BrowserRouter} from 'react-router-dom'
import { Login } from './components/login/Login'
import { Registration } from './components/registration/Regisrtration';
import {Header} from './components/Header'
import { Profile } from './components/profile/Profile';
import { Messenger } from './components/Messenger/Messenger';
import { Chat } from './components/Messenger/Chat/Chat';

export const App = () => {
  const isLog = sessionStorage.getItem('isLoggin')
  return (
    <div className="App">
        {isLog === 'true' && <Header className={'element'} />}
        <Routes>
            <Route path={'/login'} element={<Login className={'element'} />} />
            <Route path={'/registration'} element={<Registration className={'element'} />} />
            <Route path={'/profile/:login'} element={<Profile className={'element'} />} />
            <Route path={'/messenger'} element={<Messenger className={'element'} />} />
            <Route path={'/chat/:login'} element={<Chat className={'element'} />} />
        </Routes>
    </div>
  );
}
