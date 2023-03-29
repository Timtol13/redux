import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:7653',
    headers:{
        'Content-Type': 'application/json'
    }
})

export const authAPI = {
    registration(data){
        return instance.post('/registration', data)
    }
}