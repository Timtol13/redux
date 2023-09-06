import React, { useEffect, useState } from 'react'
import './Messenger.modul.scss'
import { MessagesAPI, authAPI } from '../api/api'

export const Messenger = () => {
  const [chats, setChats] = useState([])
  const [user, setUser] = useState('')
  const [users, setUsers] = useState([])

  useEffect(() => {
    setUser(JSON.parse(sessionStorage.getItem('user')).login)
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
      {chats.map(mes => {
          return (
            <a href={`/chat/${mes.login}`} className={'message'} key={mes.user}>
              <h3>{mes.username} {mes.surname} <img src={mes.status === 'online'? '/online.png' : '/offline.png'} width={10}/></h3>
            </a>
            )}
      )}
    </div>
  )
}