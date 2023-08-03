import React, { useEffect, useRef, useState } from 'react';
import './Chat.modul.scss';
import { useParams } from 'react-router';
import {io} from 'socket.io-client';
import { MessagesAPI } from '../../api/api';

// export const fetchMessages = (userFrom, userTo, setMessages) => {
//     Promise.all([
//       MessagesAPI.getMessages(userFrom, userTo),
//       MessagesAPI.getMessages(userTo, userFrom)
//     ])
//       .then(([userToMessages, userFromMessages]) => {
//         const allMessages = [...userToMessages.data, ...userFromMessages.data];
//         setMessages(allMessages);
//       })
//       .catch((error) => {
//         console.error('Ошибка при получении сообщений:', error);
//       });
//   };

export const Chat = () => {
  const { login } = useParams();
  const user = JSON.parse(sessionStorage.getItem('user')).login;
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState('');
  const socket = io('http://localhost:5500');
  const messagesEndRef = useRef(null);
  const room = 0

  const fetchMessages = () => {
    Promise.all([
      MessagesAPI.getMessages(user.login, login),
      MessagesAPI.getMessages(login, user.login)
    ])
      .then(([userToMessages, userFromMessages]) => {
        const allMessages = [...userToMessages.data, ...userFromMessages.data];
        setMessages(allMessages);
      })
      .catch((error) => {
        console.error('Ошибка при получении сообщений:', error);
      });
  };
    useEffect(() => {
        socket.on('connect', (room) => {
            console.log('Connected to server');
            socket.emit('connectToChat', user.login)
          });
          
          socket.on('message', (data) => {
            console.log('Message received: ', data);
            setMessages((prevMessages) => [...prevMessages, data]);
          });
          
          socket.on('inChat', (data) => {
            console.log('In chat message received: ', data);
            setMessages((prevMessages) => [...prevMessages, ...data]);
          });
          
          socket.on('error', (error) => {
            console.error('WebSocket error:', error);
          });
        
          socket.on('newMessage', (data) => {
            console.log('Новое сообщение:', data);
            fetchMessages();
          });
        //   return () => {
        //     socket.disconnect();
        //   };
        fetchMessages();
    }, [])

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
  }, [messages]);

  const sendMessage = () => {
    if (value.trim() !== '') {
      const message = {
        userFrom: user.login,
        userTo: login,
        message: value,
      };
      socket.emit('message', message);
      console.log("message " + value + " is sending");
      setValue('');
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
      fetchMessages();
    } else {
      // Ничего не делаем, если значение пустое или состоит только из пробелов
    }
  };
  function setFocus()
  {
    const textbox = document.getElementById("textbox")
    if(textbox){ 
        textbox.focus()
    } else {

    }
  }

  return (
    <div className={'container'} onLoad={setFocus()}>
      <h3>{login}</h3>
      <div className='content'>
        <div className={'messages'}>
          {messages.sort((el, el1) => Date.parse(el.date) - Date.parse(el1.date)).map(mes => (
            <div key={mes.id}>
              <div className={`message ${mes.userFrom === user.login ? 'usFr' : ''}`}>
                <h3 className='sender'>{mes.userFrom}</h3><br />
                <h4 className='senderText'>{mes.message}</h4>
                <h6 className='senderDate'>{new Date(mes.date).getHours()}:{new Date(mes.date).getMinutes()}</h6>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>
        <div className={'send_form'}>
          <input
            type='text'
            id='textbox'
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyUp={(e) => {
              if (e.which === 13) {
                sendMessage();
              }
            }}
          />
          <button id={'btn'} onClick={sendMessage}>Отправить</button>
        </div>
      </div>
    </div>
  );
};
