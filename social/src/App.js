import React from 'react'
import './App.scss'
import { Routes, Route } from 'react-router-dom'
import { Login } from './components/login/Login'
import { Registration } from './components/registration/Regisrtration'
import {Header} from './components/Header'
import { Profile } from './components/profile/Profile'
import { Messenger } from './components/Messenger/Messenger'
import { Chat } from './components/Messenger/Chat/Chat'
import { Home } from './components/Home/Home'
import { Photo } from './components/Photo/Photo'
import { Peoples } from './components/Peoples/Peoples'

export const App = () => {
  // const isLog = localStorage.getItem('isLoggin')
  return (
    <div className="App">
      <React.Suspense fallback={<Loader />}>
      <div className={'container'}>
        <Header />
        <div className={'element'}>
          <Routes>
              <Route path={'/login'} element={<Login />} />
              <Route path={'/'} element={<Home />} />
              <Route path={'/registration'} element={<Registration />} />
              <Route path={'/profile/:login'} element={<Profile />} />
              <Route path={'/messenger'} element={<Messenger />} />
              <Route path={'/peoples'} element={<Peoples />} />
              <Route path={'/chat/:login'} element={<Chat />} />
              <Route path={'/photos/:login'} element={<Photo />} />
          </Routes>
        </div>
      </div>
      </React.Suspense>
    </div>
  )
}

const Loader = () => {
  return <div className={"loader"}></div>
}