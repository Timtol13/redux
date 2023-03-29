import React from 'react'
import {useFormik} from 'formik'
import { createStore } from '../../redux/store/createStore'
import { login } from '../../redux/action/action'
import { authReducer } from '../../redux/reducers/rootReducer'

export const Login = () => {
    const store = createStore(authReducer, {'login': '', 'password': ''})
    const formik = useFormik({
        initialValues:{
            'login': '',
            'password': ''
        },
        onSubmit: (values) => {
            console.log(values.login + " " + values.password)
            store.dispatch(login(values.login, values.password))
        }
    })
    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <input placeholder={'Login'} {...formik.getFieldProps('login')}/>
                <input placeholder={'Password'} type={'password'} {...formik.getFieldProps('password')}/>
                <button type={'submit'}>Войти</button>
            </form>
        </div>
    )
}