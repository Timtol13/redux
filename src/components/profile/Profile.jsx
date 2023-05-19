import React, { useEffect, useState } from 'react'
import { authAPI } from '../api/api'
import './Profile.modul.scss'
import { useParams } from 'react-router'
import { createStore } from '../../redux/store/createStore'

export const Profile = () => {
    const [user, setUser] = useState({})
    const { login } = useParams()
    const [photo, setPhoto] = useState('')
    const [file, setFile] = useState(null);
    useEffect(()=>{
        authAPI.getUser(login).then(e => {setUser(e.data)})
        fetch(`http://localhost:7653/getPhoto/${login}`).then(response => response? response.blob() : '')
        .then(blob => {
            setPhoto(URL.createObjectURL(blob))
        }).catch(err => {console.log(err)})
    }, [])
    const uploadHandler = (event) => {
        setFile(event.target.files[0]);

        console.log(event.target.files[0])
        authAPI.sendPhoto({'login': user.login, 'files': event.target.files[0]})
    };
    return (
        <div className={'profile_container'}>
            <div className={'profile_photo'}>
            {
            photo !== ''?
                <div className={'frame'}>
                    <img src={`${photo}`} alt={'Oops'}/>
                </div>
            :
                <div className={'files'}>
                        <label className={'input_file'} htmlFor="button-photo">
                            <span>+</span>
                            <input type="file"
                                accept="image/*"
                                onChange={uploadHandler}
                                className={'files'}
                                id="button-photo"/>
                        </label>
                    </div>
            }
            </div>
            <div className={'profile_info'}>
                <h2>{user.Username} {user.Surname}</h2>
                <p>
                    {user.description}
                </p>
            </div>
        </div>
    )
}