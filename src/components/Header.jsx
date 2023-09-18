import React, {useEffect, useState} from 'react'
import styles from './Header.modul.scss'
import { StatusAPI, authAPI } from './api/api'
import {io} from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { Miniature } from './ProfileMiniature/Miniature';

export const Header = () => {
    const logg = localStorage.getItem('isLoggin')
    const us = localStorage.getItem('user')
    const me = us? JSON.parse(localStorage.getItem('user')).login: ''
    const socket = io('http://localhost:5500');
    const [notification, setNotification] = useState()
    // window.addEventListener('beforeunload', function (e) {
    //     StatusAPI.setOffline(me.login)
    //   }, false);
    //   window.addEventListener('load', function(e){
    //     StatusAPI.setOnline(me?.login)
    //   })
    const logoutHandler = () => {
        localStorage.setItem('isLoggin', 'false')
        localStorage.setItem('user', JSON.stringify({}))
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
        window.location.replace(`/photos/${me.login}`)
    }
    const peoplesHandler = () => {
        window.location.replace(`/peoples`)
    }
    const settingsHandler = () => {
        window.location.replace(`/settings`)
    }
    if(!us){
        logoutHandler()
    }
    useEffect(() => {
        socket.on('connect', (room) => {
            console.log('Connected to server');
            socket.emit('connectToChat', me?.login)
            socket.emit('setOnline', me?.login)
          });
        socket.on('newMessage', (data) => {
            if(window.location.pathname !== `/chat/${data.userFrom}`)
            authAPI.getUser(data.userFrom, 'null').then(e => {
                setNotification({
                    'login': data.userFrom,
                    'name': e.data[0].username,
                    'surname': e.data[0].surname,
                    'message': data.message
                })
                console.log(notification) 
            })
            .then(() => {
                setTimeout(() => {
                    setNotification(null)
                }, 6000)
            })
          });
    }, [])
    return (
        <>
            
            {logg === 'true' && 
                <div>
                    <nav>
                        <ul>
                            <li><a><Miniature login={me?.login}/></a></li>
                            <li><button onClick={profileHandler}><img src={'/profile.png'} alt={'Oops'} width={20} height={20} />Профиль</button></li>
                            <li><button onClick={newsHandler}><img src={'/news.png'} alt={'Oops'} width={20} height={20} />Новости</button></li>
                            <li><button onClick={peoplesHandler}><img src={'/peoples.png'} alt={'Oops'} width={20} height={20} />Люди</button></li>
                            <li><button onClick={messengerHandler}> <img src={'/Message.png'} alt={'Oops'} width={20} height={20} />Сообщения</button></li>
                            <li><button onClick={photoHandler}><img src={'/Photo.png'} alt={'Oops'} height={20} />Фото</button></li>
                            <li><button onClick={settingsHandler}><img src={'/settings.png'} alt={'Oops'} height={20} />Настройки</button></li>
                            <li><button className={'Exit'} onClick={logoutHandler}><img src={'/cross.png'} alt={'Oops'}  width={20} height={20}/>Выйти из уч. записи</button></li>
                        </ul>
                    <a href={'/'}><img src={'/logoText.png'} width={80} height={80} style={{marginTop: -30}}/></a>

                    </nav>
                    <div className={'marg'}></div>
                    {notification? <a href={`/chat/${notification.login}`} className={'notification'}><h2>{notification.name} {notification.surname}</h2><h3>{notification.message}</h3></a>: ''}
                </div>
            }
        </>
    )
}