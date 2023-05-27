import React, { useEffect, useState } from 'react'
import './Messenger.modul.scss'
import { MessagesAPI } from '../api/api'

export const Messenger = () => {
  const [chats, setChats] = useState([])

  useEffect(() => {
    MessagesAPI.getUsers().then(response => { setChats(response.data) })
  }, [])
  return (
    <div className={'allMessages'}>
      {chats.map(mes => (
        <a href={`/chat/${mes.user}`} className={'message'} key={mes.user}>
          <h3>{mes.user}</h3>
          <h5>
            {mes.lastMessage} {mes.date}
          </h5>
        </a>
      ))}
    </div>
  )
}