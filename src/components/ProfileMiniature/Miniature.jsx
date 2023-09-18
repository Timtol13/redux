import React, {useEffect, useState} from 'react'
import './Miniature.scss'
import { authAPI } from '../api/api'

export const  Miniature = (props) => {
    const login = props.login
    const [user, setUser] = useState({})
    const [photo, setPhoto] = useState({})
    useEffect(() => {
        authAPI.getUser(login).then(e => {setUser(e.data[0])})
        authAPI.getPhoto(login).then(e => {setPhoto(`http://localhost:7653/images/${login}/${e.data[0].filename}`)})
    }, [])
  return (
    <a className={'miniature'} href={`/profile/${login}`}>
        <div className={'miniature_profile_photo'}>
            <div className={'miniature_frame'}>
                <img src={photo} className='miniature_img'  alt=''/>
            </div>
        </div>
        <div className={'div'}>
            <h5>{user?.username} {user?.surname}</h5>
            <h6> {user?.status} </h6>
        </div>
    </a>
  )
}
