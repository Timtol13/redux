import React from 'react'
import { Link, BrowserRouter, useNavigate} from 'react-router-dom'
import styles from './Header.modul.scss'

export const Header = () => {
    const nav = useNavigate()
    const logg = sessionStorage.getItem('isLoggin')
    const us = sessionStorage.getItem('user')
    const me = us? JSON.parse(sessionStorage.getItem('user')).login: ''
    const logoutHandler = () => {
        sessionStorage.setItem('isLoggin', 'false')
        sessionStorage.setItem('user', JSON.stringify({}))
        window.location.replace('/login')
    }
    const profileHandler = () => {
        window.location.replace(`/profile/${me.login}`)
    }
    const messengerHandler = () => {
        window.location.replace('/messenger')
    }
    const newsHandler = () => {
        window.location.replace('/')
    }
    const photoHandler = () => {
        window.location.replace('/photo')
    }
    return (
        <>
            {logg === 'true' && 
                <div>
                    <nav>
                        <ul>
                            <li><button onClick={profileHandler}><img src={'/profile.png'} alt={'Oops'} width={20} height={20} />Профиль</button></li>
                            <li><button onClick={newsHandler}><img src={'/news.png'} alt={'Oops'} width={20} height={20} />Новости</button></li>
                            <li><button onClick={messengerHandler}> <img src={'/Message.png'} alt={'Oops'} width={20} height={20} />Сообщения</button></li>
                            <li><button onClick={photoHandler}><img src={'/Photo.png'} alt={'Oops'} height={20} />Фото</button></li>
                            <li><button className={'Exit'} onClick={logoutHandler}><img src={'/cross.png'} alt={'Oops'}  width={20} height={20}/>Выйти из уч. записи</button></li>
                        </ul>
                    </nav>
                    <div className={'marg'}></div>
                    
                </div>
            }
        </>
    )
}