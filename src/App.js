import './App.scss'
import { Routes, Route, BrowserRouter} from 'react-router-dom'
import { Login } from './components/login/Login'
import { Registration } from './components/registration/Regisrtration'
import {Header} from './components/Header'
import { Profile } from './components/profile/Profile'
import { Messenger } from './components/Messenger/Messenger'
import { Chat } from './components/Messenger/Chat/Chat'
import { Home } from './components/Home/Home'
import { Photo } from './components/Photo/Photo'
import { Peoples } from './components/Peoples/Peoples'
import { Settings } from './components/Settings/Settings'

export const App = () => {
  const isLog = localStorage.getItem('isLoggin')
  return (
    <div className="App">
        <Header />
        <Routes>
            <Route path={'/login'} element={<Login className={'element'} />} />
            <Route path={'/'} element={<Home className={'element'} />} />
            <Route path={'/registration'} element={<Registration />} />
            <Route path={'/profile/:login'} element={<Profile className={'element'} />} />
            <Route path={'/messenger'} element={<Messenger className={'element'} />} />
            <Route path={'/peoples'} element={<Peoples className={'element'} />} />
            <Route path={'/chat/:login'} element={<Chat className={'element'} />} />
            <Route path={'/photos/:login'} element={<Photo className={'element'} />} />
            <Route path={'/settings'} element={<Settings className={'element'} />} />
        </Routes>
    </div>
  )
}
