import React, { useEffect, useRef, useState } from 'react';
import './Chat.modul.scss';
import { useParams } from 'react-router';
import {io} from 'socket.io-client';
import { MessagesAPI, authAPI } from '../../api/api';
import {Helmet} from "react-helmet";
import { Miniature } from '../../ProfileMiniature/Miniature';

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
  const API_URL = 'http://localhost:7653';
  const SOCKET_URL = 'ws://localhost:7653';

  const { login } = useParams();
  const user = JSON.parse(localStorage.getItem('user')).login;

  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState('');
  const [us, setUser] = useState({});

  const [socket, setSocket] = useState(io(SOCKET_URL))
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const [userToMessages, userFromMessages] = await Promise.all([
        MessagesAPI.getMessages(user.login, login),
        MessagesAPI.getMessages(login, user.login)
      ]);

      const allMessages = [...userToMessages.data, ...userFromMessages.data];
      setMessages(allMessages);
    } catch (error) {
      console.error('Ошибка при получении сообщений:', error);
    }
  };

  useEffect(() => {
    authAPI.getUser(login, 'password').then(e => setUser(e.data[0]));

    socket.on('connect', () => {
      console.log('Connected to server');
      socket.emit(JSON.stringify({ type: 'connectToChat', login: user.login }));
    });
  
    socket.on('newMessage', (event) => {
      console.log('qwe');
      fetchMessages()
    });
  
    socket.on('error', (error) => {
      console.log('Socket произошла ошибка:', error);
    });
  
    socket.on('close', (event) => {
      console.log('Socket закрыт:', event);
    });
  
    fetchMessages();
  }, []);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }
  }, [messages]);
  
  const sendMessage = () => {
    if (value.trim() !== '') {
      const message = {
        userFrom: user.login,
        userTo: login,
        message: value,
        socketId: socket.id
      };
      socket.emit('message', JSON.stringify({ type: 'message', content: message }));
      setValue('');
    }
    else {
      console.error('WS has been closed')
    }
  };
  

  const setFocus = () => {
    const textbox = document.getElementById("textbox");
    if(textbox) textbox.focus();
  };

  const upload = (files, filename) => {
    socket.emit("upload", files[0], filename, user.login, login, status => console.log(status));
  };

  const userTitle = `${us?.username} ${us?.surname}`;


  return (
    <div className={'chatContainer'} onLoad={setFocus()}>
      <Helmet>
        <title>{userTitle}</title>
      </Helmet>
      <h3><Miniature login={login}/></h3>
      <div className='content'>
        <div className={'messages'}>
          {messages?.sort((el, el1) => Date.parse(el.date) - Date.parse(el1.date))?.map(mes => (
            <div key={mes.id}>
                <div className={`message ${mes.userfrom === user.login ? 'usFr' : ''}`}>
                  <h3 className='sender'>{mes.userfrom}</h3><br />
                  {mes.type === 'file'? <><img className='senderText' alt={'Скачать'} src={`${API_URL}/images/messages/${mes.userfrom}/${mes.userto}/${mes.message}`}/> <a className='download' href={`${API_URL}/images/messages/${mes.userFrom}/${mes.userTo}/${mes.message}`}><img src={'/install.png'} width={20}/></a></> : <h4 className='senderText'>{mes.message}</h4>}
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
            <label className="input-file">
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
