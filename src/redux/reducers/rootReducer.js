import {LOGIN, REGISTRATION} from '../../types'

let user = [{'login': 'qwe', 'password': 'qwe'}]

export function authReducer(state, action){
    switch (action.type){
        case LOGIN:{
            user.forEach(us => {console.log(us.login)})
            user.forEach(us => {
                if(action.payload.login === us.login)
                {
                    if(action.payload.password === us.password)
                    {
                        const user_login = {
                            'login': action.payload.login,
                            'password': action.payload.password 
                        }
                        console.log("Is loggin")
                        sessionStorage.setItem('user', JSON.stringify(user_login))
                        sessionStorage.setItem('isLoggin', true)
                        window.location.replace(`/profile/${user_login.login}`)
                    }
                } else { console.log("Uncorrect login") }
            })
            
            break
        }
        case REGISTRATION:{
            const user_login = {
                'login': action.payload.login,
                'password': action.payload.password 
            }
            console.log("Is loggin")
            user.push(JSON.stringify(user_login))
            user.forEach(us => {console.log(us)})
            window.location.replace('/')
            break
        }
    }
}