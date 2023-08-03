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
            sessionStorage.setItem('user', JSON.stringify({'login': res.data}))
            sessionStorage.setItem('likes', JSON.stringify([]))
            window.location.replace(`/profile/${login}`)
        })
    },
    sendPhoto(login, files){
        return instancePhoto.post('/sendPhoto', login, files)
    },
    getPhoto(login){
        return instance.get(`/getPhoto/${login}`)
    },
    getUserPhotoes(login){
        return instance.get(`/getPhotoes/${login}`)
    }
}
export const MessagesAPI = {
    getUsers(){
        return instance.get('/getUsers')
    },
    getMessages(userFrom, userTo){
        return instance.get(`/getMessages/${userFrom}/${userTo}`)
    }
}

export const PostsAPI = {
    getPosts(){
        return instance.get('/getPosts')
    },
    createPost({ login, name, surname, description, photo }){
        return instancePhoto.post('/createPost', { login, name, surname, description, photo })
    },
    like(id){
        return instance.put('/like', {id})
    },
    unlike(id){
        return instance.put('/unlike', {id})
    }
}
export const StatusAPI = {
    setOnline(login){
        return instance.post(`/setOnline/${login}`)
    },
    setOffline(login){
        return instance.post(`/setOffline/${login}`)
    }
}
