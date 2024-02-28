import React, {useEffect, useState} from 'react'
import './Header.modul.scss';
import { authAPI } from './api/api'
import {io} from 'socket.io-client';
import { Link } from 'react-router-dom';
import { Miniature } from './ProfileMiniature/Miniature';

export const Header = () => {
    const logg = localStorage.getItem('isLoggin')
    const us = localStorage.getItem('user')
    const me = us? JSON.parse(localStorage.getItem('user')).login: ''
    const [notification, setNotification] = useState()
    const logoutHandler = () => {
        localStorage.setItem('isLoggin', 'false')
        localStorage.setItem('user', JSON.stringify({}))
    }
    useEffect(() => {
        const socket = io('ws://localhost:7653');
        us? socket.emit('connectToChat', me?.login) : ''
        socket.on('connect', (room) => {
            console.log('connect')
            // socket.emit('setOnline', me?.login)
        });
        socket.on('newMessage', (data) => {
            if (data.userFrom === e.data[0].username) return;
            if(window.location.pathname !== `/chat/${data.userFrom}`)
            authAPI.getUser(data.userFrom, 'null').then(e => {
                setNotification({
                    'login': data.userFrom,
                    'name': e.data[0].username,
                    'surname': e.data[0].surname,
                    'message': data.message
                })
            })
            .then(() => {
                setTimeout(() => {
                    setNotification(null)
                }, 6000)
            })
          });
          socket.on('newLike', (data) => {
            authAPI.getUser(data.login, 'null').then(e => {
                setNotification({
                    'login': data.login,
                    'name': e.data[0].username,
                    'surname': e.data[0].surname,
                    'message': data.message
                })
            })
            .then(() => {
                setTimeout(() => {
                    setNotification(null)
                }, 6000)
            })
          });
          window.addEventListener('beforeunload', (e) => {
            socket.emit('disconnectUser', {'login': me?.login})
          }, false);
          window.addEventListener('load', (e) => {
            socket.emit('connectToChat', {'login': me?.login})
          })
        return () => {
            socket.disconnect();
        };
    }, [])
    
    return (
        <>  
            {
            logg === 'true' &&
                <div className='header'>
                    <nav>
                        <ul>
                            <li><Link className={'button miniature'} to={`/profile/${me.login}`}><Miniature login={me?.login}/></Link></li>
                            <li><Link className={'button'} to={`/profile/${me.login}`}><img src={'/profile.png'} alt={'Oops'} width={20} height={20} />Профиль</Link></li>
                            <li><Link className={'button'} to={'/'}><img src={'/news.png'} alt={'Oops'} width={20} height={20} />Новости</Link></li>
                            <li><Link className={'button'} to={'/peoples'}><img src={'/peoples.png'} alt={'Oops'} width={20} height={20} />Люди</Link></li>
                            <li><Link className={'button'} to={'/messenger'}> <img src={'/Message.png'} alt={'Oops'} width={20} height={20} />Сообщения</Link></li>
                            <li><Link className={'button'} to={`/photos/${me.login}`}><img src={'/Photo.png'} alt={'Oops'} height={20} />Фото</Link></li>
                            <li><Link className={'button Exit'} onClick={logoutHandler}><img src={'/cross.png'} alt={'Oops'}  width={20} height={20}/>Выйти из уч. записи</Link></li>
                        </ul>
                    <a href={'/'} className='headerLogo'><img src={'/logoText.png'} width={80} height={80} style={{marginTop: -30}}/></a>
                    </nav>
                    {notification? <a href={`/chat/${notification.login}`} className={'notification'}><h2>{notification.name} {notification.surname}</h2><h3>{notification.message}</h3></a>: ''}
                </div>
            }
        </>
    )
}