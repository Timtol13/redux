import React, {useState} from 'react'
import {useFormik} from 'formik'
import './Login.modul.scss'
import { authAPI } from '../api/api'
import {Helmet} from "react-helmet";

function Login() {
    const [error, setError] = useState()
    const formik = useFormik({
        initialValues:{
            'login': '',
            'password': ''
        },
        onSubmit: (values) => {
            authAPI.login(values.login, values.password)
            .catch((e) => {
                setError("Неверный логин или пароль");
                return Promise.reject(e);
            })
            .then((res) => {
                localStorage.setItem('isLoggin', 'true')
                localStorage.setItem('user', JSON.stringify({'login': res.data}))
                window.location.replace(`/profile/${values.login}`)
            })
            .catch((error) => {
                console.error(error);
            }); 
        }
    })
    return (
        <div className='divLogin'>
            <Helmet>
                <title>Login</title>
            </Helmet>
            <img src={'Devices1.png'} alt={'Oops'} width={890} />
            <form onSubmit={formik.handleSubmit}>
                <input placeholder={'Логин'} {...formik.getFieldProps('login')}/>
                <input placeholder={'Пароль'} type={'password'} {...formik.getFieldProps('password')}/>
                {error? error : ''}
                <button type={'submit'}>Войти</button>
                <h5>Ещё нет аккаунта? <a href={'/registration'}>Зарегестрируйтесь!</a></h5>
            </form>
        </div>
    )
}

export default Login;