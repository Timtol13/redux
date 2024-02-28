import React, { useState } from 'react'
import {useFormik} from 'formik'
import { authAPI } from '../api/api'
import './Registration.modul.scss'
import { Helmet } from 'react-helmet'

const Registration = () => {
    const [error, setError] = useState()
    const formik = useFormik({
        initialValues:{
            'login': '',
            'password': '',
            'name': '',
            'surname': '',
            'description': '',
        },
        onSubmit: (values) => {
            authAPI.registration(values)
        .catch((e) => {
            setError(e.response.data);
            return Promise.reject(e);
        })
        .then((res) => {
            console.log(res);
            window.location.replace(`/login`);
        })
        .catch((error) => {
            console.error(error);
        }); 
        }
    })
    return (
        <div className='divRegistration'>
            <Helmet>
                <title>Регистрация</title>
            </Helmet>
            <div className={'image'}>
                    <img src={'Devices1.png'} alt={'Oops'} width={890} />
                </div>
            <form onSubmit={formik.handleSubmit}>
                <input placeholder={'Login'} {...formik.getFieldProps('login')}/>
                <input placeholder={'Password'} type={'password'} {...formik.getFieldProps('password')}/>
                <input placeholder={'Name'} type={'text'} {...formik.getFieldProps('name')}/>
                <input placeholder={'Surname'} type={'text'} {...formik.getFieldProps('surname')}/>
                <textarea placeholder={'Description'} {...formik.getFieldProps('description')}/>
                {error? error : ''}
                <button type={'submit'}>Зарегестрироваться</button>
                <h>Уже есть аккаунт? <a href={'/login'}>Войдите!</a></h>
            </form>
        </div>
    )
}

export default Registration