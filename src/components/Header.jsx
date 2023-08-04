import React, {useEffect, useState} from 'react'
import styles from './Header.modul.scss'
import { StatusAPI, authAPI } from './api/api'
import {io} from 'socket.io-client';

export const Header = () => {
    const logg = sessionStorage.getItem('isLoggin')
    const us = sessionStorage.getItem('user')
    const me = us? JSON.parse(sessionStorage.getItem('user')).login: ''
    const socket = io('http://localhost:5500');
    const [notification, setNotification] = useState()
    window.addEventListener('beforeunload', function (e) {
        StatusAPI.setOffline(me.login)
      }, false);
      window.addEventListener('load', function(e){
        StatusAPI.setOnline(me.login)
      })
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
    if(!us){
        logoutHandler()
    }
    const [notifData, setNotifData] = useState({})
    useEffect(() => {
        socket.on('connect', (room) => {
            console.log('Connected to server');
            socket.emit('connectToChat', me.login)
          });
        socket.on('newMessage', (data) => {
            authAPI.getUser(data.userFrom, 'null').then(e => {
                setNotification({
                    'login': data.userFrom,
                    'name': e.data.Username,
                    'surname': e.data.Surname,
                    'message': data.message
                })
                console.log(notification) 
            })
            .then(() => {
                setTimeout(() => {
                    setNotification(null)
                }, 4000)
            })
          });
    }, [])
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
                    {notification? <div className={'notification'}><h2>{notification.name} {notification.surname}</h2><h3>{notification.message}</h3></div>: ''}
                </div>
            }
        </>
    )
}