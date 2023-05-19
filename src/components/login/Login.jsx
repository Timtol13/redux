import React from 'react'
import {useFormik} from 'formik'
import { createStore } from '../../redux/store/createStore'
import { login } from '../../redux/action/action'
import './Login.modul.scss'
import { authReducer } from '../../redux/reducers/rootReducer'
import { authAPI } from '../api/api'

export const Login = () => {
    const store = createStore(authReducer, {'login': '', 'password': ''})
    const formik = useFormik({
        initialValues:{
            'login': '',
            'password': ''
        },
        onSubmit: (values) => {
            authAPI.login(values.login, values.password)
            //window.location.replace(`/${values.login}`)
        }
    })
    return (
        <div>
            <div className={'image'}>
                <img src={'Devices.png'} alt={'Oops'} width={890} />
            </div>
            <form onSubmit={formik.handleSubmit}>
                <input placeholder={'Login'} {...formik.getFieldProps('login')}/>
                <input placeholder={'Password'} type={'password'} {...formik.getFieldProps('password')}/>
                <button type={'submit'}>Войти</button>
                <h>Ещё нет аккаунта? <a href={'/registration'}>Зарегестрируйтесь!</a></h>
            </form>
        </div>
    )
}