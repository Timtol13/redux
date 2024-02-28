import React, { useEffect, useState } from 'react'
import './Messenger.modul.scss'
import { MessagesAPI, authAPI } from '../api/api'
import {Helmet} from "react-helmet";
import { Miniature } from '../ProfileMiniature/Miniature';

function Messenger() {
  const [chats, setChats] = useState([])
  const [user, setUser] = useState('')
  const [users, setUsers] = useState([])

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')).login)
  }, [])
  useEffect(() => {
    MessagesAPI.getChats(user.login).then(response => { setUsers(response.data) })
  }, [user])
  useEffect(() => {
    users.map((el) => {
      authAPI.getUser(el).then((e) => {
        setChats(prev => [...prev, e.data[0]])
      })
    })
  }, [users])
  console.log(chats)
  return (
    <div className={'allMessages'}>
      <Helmet>
          <title>Сообщения</title>
      </Helmet>
      {chats.filter(item => item !== undefined).map(mes => {
          return (
            <a href={`/chat/${mes?.login}`} className={'message'} key={mes?.user}>
              <Miniature login={mes?.login}/>
            </a>
            )}
      )}
    </div>
  )
}

export default Messenger;