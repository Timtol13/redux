import React from 'react'
import {useFormik} from 'formik'
import { createStore } from '../../redux/store/createStore'
import { registration } from '../../redux/action/action'
import { authReducer } from '../../redux/reducers/rootReducer'
import { registration as reg } from '../../redux/bll/authReducer'

export const Registration = () => {
    const store = createStore(authReducer, {'login': '', 'password': ''})
    const formik = useFormik({
        initialValues:{
            'login': '',
            'password': ''
        },
        onSubmit: (values) => {
            console.log(values.login + " " + values.password)
            store.dispatch(reg({values}))
        }
    })
    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <input placeholder={'Login'} {...formik.getFieldProps('login')}/>
                <input placeholder={'Password'} type={'password'} {...formik.getFieldProps('password')}/>
                <button type={'submit'}>Зарегестрироваться</button>
            </form>
        </div>
    )
}