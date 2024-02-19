import React, {useState, useEffect} from 'react'
import './Peoples.scss'
import { MessagesAPI } from '../api/api'
import { Miniature } from '../ProfileMiniature/Miniature'
import { Helmet } from 'react-helmet'

export const Peoples = () => {
  const [peoples, setPeoples] = useState([])
  const user =  JSON.parse(localStorage.getItem('user')).login
  useEffect(() => {
    MessagesAPI.getUsers().then(e => {setPeoples(e.data)})
  }, [])
  return (
    <div className={'allPeoples'}>
      <Helmet>
          <title>Люди</title>
      </Helmet>
        {peoples.map(people => {
          
            return (
              <>
                {people.login !== user.login ? 
                  <a href={`/profile/${people.login}`} className={'people'} key={people.id}>
                    <Miniature login={people.login} />
                  </a>
                  :
                <>
                </>
                }
              </>
            )})
        }
    </div>
  )
}

//<Miniature login={login} />