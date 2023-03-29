import { createAsyncThunk } from '@reduxjs/toolkit'
import { dispatch } from '../store/createStore'
import { authAPI } from '../../components/api/api'

export const registration = createAsyncThunk(
    'registration', 
    (data, {dispatch}) => {
        try {
            const res = authAPI.registration(data) 
            localStorage.setItem('user', JSON.stringify(data))
            localStorage.setItem('isLoggin', true)
        } catch (err) { console.log(err) }
    }
)