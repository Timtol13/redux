import './App.css';
import { Routes, Route, BrowserRouter} from 'react-router-dom'
import { Login } from './components/login/Login'
import { Registration } from './components/registration/Regisrtration';
import {Header} from './components/Header'

export const App = () => {
  return (
    <div className="App">
      <Header />
        <Routes>
            <Route path={'/login'} element={<Login />} />
            <Route path={'/registration'} element={<Registration />} />
        </Routes>
    </div>
  );
}
