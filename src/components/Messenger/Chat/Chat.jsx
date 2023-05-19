import React, {useEffect, useRef, useState} from 'react'
import './Chat.modul.scss'
import { useParams } from 'react-router'
import io from 'socket.io-client';
import { MessagesAPI } from '../../api/api';

export const Chat = () => {
    const {login } = useParams()
    const user = JSON.parse(sessionStorage.getItem('user')).login
    const [messages, setMessages] = useState([])
    const [value, setValue] = useState('')
    const socket = io('http://localhost:5500');
    const fetchMessages = () => {
        let arr = []
        MessagesAPI.getMessages(user.login, login).then(e => {e.data.map(d => {arr.push(d)}); })
        MessagesAPI.getMessages(login, user.login).then(e => {e.data.map(d => {arr.push(d)});
            console.log(arr); 
            console.log(arr.sort((el, el1) => el.date - el1.date)); 
            setMessages(arr.sort((el, el1) => el.date - el1.date)) })
    }
    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to server')
        });
        socket.on('message', (data) => {
            console.log('Message received: ', data)
        });
        fetchMessages()
    }
    , [])
    const sendMessage = () => {
        let message = {
            userFrom: user.login,
            userTo: login,
            message: value,
        }
        socket.emit('message', message)
        console.log("message " + value + " is sending")
        fetchMessages()
        setValue('')
    }
    return (
        <div className={'container'}>
            <h3>{login}</h3>
            <div className='content'>
                <div className={'messages'}>
                    {messages.map(mes => {
                        return <div key={mes.id}>
                                {
                                    <div className="message">
                                        {mes.userFrom}<br /> {mes.message}
                                    </div>
                                }
                            </div>
                    })}
                </div>
                <div className={'send_form'}>
                    <input type='text' value={value} onChange={e => setValue(e.target.value)} />
                    <button onClick={sendMessage}>Отправить</button>
                </div>
            </div>
        </div>
    )
}