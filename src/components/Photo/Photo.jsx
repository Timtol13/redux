import React, { useEffect, useState } from 'react'
import './Photo.scss'
import { authAPI } from '../api/api'

export const Photo = () => {
    const [userPhotoes, setUserPhotoes] = useState([])
    const user = JSON.parse(sessionStorage.getItem('user')).login
    useEffect(() => {
        authAPI.getUserPhotoes(user.login).then((e) => {
            setUserPhotoes(e.data)
        })
    }, [])
    console.log(userPhotoes)
  return (
    <div  className={'photoMainDiv'}>
        {
            userPhotoes? userPhotoes.map(el => {
                return (
                    <img src={`http://localhost:7653/images/${user.login}/${el.filename}`}/>
                )
            }) : ''
        }
    </div>
  )
}
