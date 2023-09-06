import React from 'react'
import {useFormik} from 'formik'
import { createStore } from '../../redux/store/createStore'
import { authReducer } from '../../redux/reducers/rootReducer'
import { authAPI } from '../api/api'
import './Registration.modul.scss'

export const Registration = () => {
    const formik = useFormik({
        initialValues:{
            'login': '',
            'password': '',
            'name': '',
            'surname': '',
            'description': '',
        },
        onSubmit: (values) => {
            authAPI.registration(values).catch(() => {console.log('error')}).then(() => {window.location.replace(`/login`)})
            
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
                <input placeholder={'Name'} type={'text'} {...formik.getFieldProps('name')}/>
                <input placeholder={'Surname'} type={'text'} {...formik.getFieldProps('surname')}/>
                <textarea placeholder={'Description'} {...formik.getFieldProps('description')}/>
                <button type={'submit'}>Зарегестрироваться</button>
                <h>Уже есть аккаунт? <a href={'/login'}>Войдите!</a></h>
            </form>
        </div>
    )
}