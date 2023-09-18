import React, { useEffect, useRef, useState } from 'react';
import './Chat.modul.scss';
import { useParams } from 'react-router';
import {io} from 'socket.io-client';
import { MessagesAPI, authAPI } from '../../api/api';
import {Helmet} from "react-helmet";

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
  const api = 'http://localhost:7653'
  const { login } = useParams();
  const user = JSON.parse(localStorage.getItem('user')).login;
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState('');
  const socket = io('http://localhost:5500');
  const messagesEndRef = useRef(null);
  const room = 0
  const [us, setUser] = useState({})

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
        authAPI.getUser(login, 'password').then(e => {setUser(e.data[0])})
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
          })
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
  function upload(files, filename) {
    socket.emit("upload", files[0], filename, user.login, login, (status) => {
      console.log(status);
    });
  }

  const userTitle = `${us?.username} ${us?.surname}`

  return (
    <div className={'container'} onLoad={setFocus()}>
      <Helmet>
        <title>{userTitle}</title>
      </Helmet>
      <h3>{us?.username} {us?.surname} <img src={us?.status === 'online'? '/online.png' : '/offline.png'} width={10}/></h3>
      <div className='content'>
        <div className={'messages'}>
          {messages?.sort((el, el1) => Date.parse(el.date) - Date.parse(el1.date))?.map(mes => (
            <div key={mes.id}>
                <div className={`message ${mes.userfrom === user.login ? 'usFr' : ''}`}>
                  <h3 className='sender'>{mes.userfrom}</h3><br />
                  {mes.type === 'file'? <><img className='senderText' alt={'Скачать'} src={`${api}/images/messages/${mes.userfrom}/${mes.userto}/${mes.message}`}/> <a className='download' href={`${api}/images/messages/${mes.userFrom}/${mes.userTo}/${mes.message}`}><img src={'/install.png'} width={20}/></a></> : <h4 className='senderText'>{mes.message}</h4>}
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
            <label class="input-file">
                <input type="file" name="file" onChange={(e) => {
                  upload(e.target.files, e.target.files[0].name)
                }}/>		
                <span><img src={'/file.png'} width={30} height={30}/></span>
            </label>
          <button id={'btn'} onClick={sendMessage}>Отправить</button>
        </div>
      </div>
    </div>
  );
};
