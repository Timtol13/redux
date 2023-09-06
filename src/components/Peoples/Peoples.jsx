import React, {useState, useEffect} from 'react'
import './Peoples.scss'
import { MessagesAPI } from '../api/api'
import { Miniature } from '../ProfileMiniature/Miniature'

export const Peoples = () => {
  const [peoples, setPeoples] = useState([])
  const [user, setUser] = useState('')
  useEffect(() => {
    MessagesAPI.getUsers().then(e => {setPeoples(e.data)})
    setUser(JSON.parse(sessionStorage.getItem('user')).login)
  }, [])
  console.log(peoples)
  return (
    <div className={'allPeoples'}>
      {peoples.map(people => {
        if (people.login !== user.login){
          return (
            <a href={`/profile/${people.login}`} className={'people'} key={people.id}>
              <Miniature login={people.login} />
            </a>
            )}
      })}
    </div>
  )
}

//<Miniature login={login} />