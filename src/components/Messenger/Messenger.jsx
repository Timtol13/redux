import React, { useEffect, useState } from 'react'
import './Messenger.modul.scss'
import { MessagesAPI } from '../api/api'

export const Messenger = () => {
  const [chats, setChats] = useState([])
  const [user, setUser] = useState('')

  useEffect(() => {
    MessagesAPI.getUsers().then(response => { setChats(response.data) })
    setUser(JSON.parse(sessionStorage.getItem('user')).login)
  }, [])
  return (
    <div className={'allMessages'}>
      {chats.map(mes => {
        if (mes.login !== user.login){
          return (
            <a href={`/chat/${mes.login}`} className={'message'} key={mes.user}>
              <h3>{mes.Username} {mes.Surname}</h3>
            </a>
            )}
      })}
    </div>
  )
}