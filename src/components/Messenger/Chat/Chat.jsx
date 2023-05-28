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
    const messagesEndRef = useRef(null);
    var arr = []
    const fetchMessages = () => {
        MessagesAPI.getMessages(user.login, login).then(e => {e.data.map(d => {arr.push(d)}); })
        MessagesAPI.getMessages(login, user.login).then(e => {e.data.map(d => {arr.push(d)});
            setMessages(arr); arr = [];})
    }
    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to server')
        });
        socket.on('message', (data) => {
            console.log('Message received: ', data)
        });
        fetchMessages()
    }, [])
    useEffect(() => {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }
    , [messages])
    const sendMessage = () => {
        let message = {
            userFrom: user.login,
            userTo: login,
            message: value,
        }
        socket.emit('message', message)
        console.log("message " + value + " is sending")
        setValue('')
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }
    return (
        <div className={'container'}>
            <h3>{login}</h3>
            <div className='content'>
                <div className={'messages'}>
                    {messages.sort((el, el1) => Date.parse(el.date) - Date.parse(el1.date)).map(mes => {
                        return (
                            <div key={mes.id}>
                                {
                                    <div className={`message ${mes.userFrom === user.login? 'usFr' : ''}`}>
                                        <h3 className='sender'>{mes.userFrom}</h3><br />
                                        <h4 className='senderText'>{mes.message}</h4>
                                    </div>
                                }
                            </div>)
                    })}
                    <div ref={messagesEndRef}></div>
                </div>
                <div className={'send_form'}>
                    <input type='text' value={value} onChange={e => setValue(e.target.value)} />
                    <button onClick={sendMessage}>Отправить</button>
                </div>
            </div>
        </div>
    )
}