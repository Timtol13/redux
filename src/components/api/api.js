import axios from 'axios'
//import OpenAI from 'openai'

// const gptApi = new OpenAI({ 
//     apiKey: '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' 
// })

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
        return instance.post('/registration', login, password, name, surname, description)
    },
    getUser(login, password){
        return instance.get(`/user/${login}`)
    },
    getAllUsers(){
        return instance.get('/users')
    },
    login(login, password){
        return instance.get(`/login/${login}/${password}`)
    },
    sendPhoto(login, status, files){
        return instancePhoto.post('/sendPhoto', login, status, files)
    },
    getPhoto(login){
        return instance.get(`/getPhoto/${login}`)
    },
    getUserPhotoes(login){
        return instance.get(`/getPhotos/${login}`)
    }
}
export const MessagesAPI = {
    getUsers(){
        return instance.get('/getUsers')
    },
    getChats(user){
        return instance.get(`/getChats/${user}`)
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
    // like({id, login}){
    //     return instance.put('/like', {id, login})
    // },
    // unlike({id, login}){
    //     return instance.put('/unlike', {id, login})
    // }
}
export const StatusAPI = {
    setOnline(login){
        return instance.post(`/setOnline/${login}`)
    },
    setOffline(login){
        return instance.post(`/setOffline/${login}`)
    }
}
export const PhotoAPI = {
    // like({login, filename, likeTo}){
    //     return instance.put('/likePhoto', {login, filename, likeTo})
    // },
    // unlike({id, login, likeTo}){
    //     return instance.put('/dislikePhoto', {id, login, likeTo})
    // }
}
export const CommentsAPI = {
    sendCommentToPhoto(data){
        return instance.put('/commentPhoto', data)
    }
}
export const ChangeProfileAPI = {
    putName({name, surname, login}){
        return instance.put(`/changeName/${login}`, {name, surname})
    },
    putDescription({description, login}){
        return instance.put(`/changeDescription/${login}`, {description})
    }
}

export const gptAPI = {
    async requestToChat(message){
        // const response = await gptApi.chat.completions.create({
        //     messages: [{ role: 'user', content: message }],
        //     model: 'gpt-3.5-turbo',
        //   });
        // return response.choices()
    }
}
