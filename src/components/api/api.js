import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:7653',
    headers:{
        'Content-Type': 'application/json'
    }
})
const instancePhoto = axios.create({
    baseURL: 'http://localhost:7653',
    headers:{
        'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
    }
})

export const authAPI = {
    registration(login, password, name, surname, description){
        return instance.post('/registration', login, password, name, surname, description).then((res) => {
            this.getUser(login, password)
        })
    },
    getUser(login, password){
        return instance.get(`/user/${login}`)
    },
    getAllUsers(){
        return instance.get('/users')
    },
    login(login, password){
        return instance.get(`/login/${login}/${password}`).then((res) => {
            sessionStorage.setItem('isLoggin', 'true')
            console.log(res)
            sessionStorage.setItem('user', JSON.stringify({'login': res.data}))
            window.location.replace(`/profile/${login}`)
        })
    },
    sendPhoto(login, files){
        return instancePhoto.post('/sendPhoto', login, files)
    }
}
export const MessagesAPI = {
    getMessages(userFrom, userTo){
        return instance.get(`/getMessages/${userFrom}/${userTo}`)
    }
}
