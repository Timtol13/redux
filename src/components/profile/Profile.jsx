import React, { useEffect, useState } from 'react'
import { ChangeProfileAPI, authAPI } from '../api/api'
import './Profile.modul.scss'
import { useParams } from 'react-router'
import { createStore } from '../../redux/store/createStore'
import { Box, Modal } from '@mui/material'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '30%',
    height: '50vh',
    transform: 'translate(-50%, -50%)',
    bgcolor: '#fff',
    boxShadow: 24,
    borderRadius: 3,
  };

export const Profile = () => {
    const [user, setUser] = useState({})
    const userStorage = JSON.parse(sessionStorage.getItem('user')).login
    const { login } = useParams()
    const [photo, setPhoto] = useState('')
    const [file, setFile] = useState(null);
    const [res, setRes] = useState(null)
    useEffect(()=>{
        authAPI.getUser(login).then(e => {setUser(e.data[0])})
        authAPI.getPhoto(login).then(e => {setPhoto(`http://localhost:7653/images/${login}/${e.data[0].filename}`)})
        setRes(photo)
    }, [])
    const uploadHandler = (event) => {
        setFile(event.target.files[0]);
        console.log(event.target.files[0])
        authAPI.sendPhoto({'login': login, 'status': 'main', 'files': event.target.files[0]}).then(() => {window.location.reload()})
    };
    
    const [open, setOpen] = useState(false)
    const [type, setType] = useState('')
    const [Name, setName] = useState('')
    const [Surname, setSurname] = useState('')
    const [Description, setDescription] = useState('')
    const handlerOpen = () => setOpen(true)
    const handlerClose = () => setOpen(false)
    useEffect(() => {
        setName(user.username);
        setSurname(user.surname);
        setDescription(user.description);
    }, [user])

    return (
        <div className={'profile_container'}>
            <div className={'firstBlock'}>
                <div className={'profile_photo'}>
                {
                res?
                    <div className={'frame'}>
                        <img src={photo} onMouseOver={() => {
                            if(userStorage.login === login) setRes(null)
                        }} alt=''/>
                    </div>
                :
                <>
                {userStorage.login === login? 
                        <div className={'files'} onMouseOut={() => {
                            setRes(photo)
                        }}>
                                <label className={'input_file'} htmlFor="button-photo">
                                    <span>+</span>
                                    <input type="file"
                                        accept="image/*"
                                        onChange={uploadHandler}
                                        className={'files'}
                                        id="button-photo"/>
                                </label>
                            
                            
                        </div>
                        : 
                        <div className={'frame'}>
                        </div>
                        }
                </>
                }
                
                </div>
                {userStorage.login !== login? 
                <ul>
                    <li><a href={`/chat/${login}`}> <img src={'/Message.png'} alt={'Oops'} width={20} height={20} />Написать</a></li>
                    <li><a href={`/photos/${login}`}><img src={'/Photo.png'} alt={'Oops'} height={20} />Фото {Name}</a></li>
                </ul>
                : ''}
            </div>
            
            <div className={'profile_info'}>
                <h2>{Name} {Surname} {userStorage.login === login? <button onClick={() => {handlerOpen(); setType('name');}}><img src={'/edit.png'} width={20}/></button> : '' }</h2>
                <p>
                    {Description}
                    {userStorage.login === login? <button onClick={() => {handlerOpen(); setType('description');}}><img src={'/edit.png'} width={20}/></button> : '' }
                </p>
            </div>
            <Modal 
                open={open}
                onClose={handlerClose}
                >
                <Box sx={style}>
                    {type === 'name'?
                    <div className={'change changeName'}>
                        <input value={Name} onChange={e => {setName(e.target.value)}}/>
                        <input value={Surname} onChange={e => {setSurname(e.target.value)}}/>
                        <button onClick={() => {
                            ChangeProfileAPI.putName({'name': Name, 'surname': Surname, 'login': userStorage.login}).catch(() => {console.log('error')}).then(() => {handlerClose()})
                        }}>Сохранить</button>
                    </div> 
                    : 
                    <div className={'change changeDescription'}>
                        <textarea value={Description} onChange={e => {setDescription(e.target.value)}}>
                        </textarea>
                        <button onClick={() => {
                            ChangeProfileAPI.putDescription({'description': Description, 'login': userStorage.login}).catch(() => {console.log('error')}).then(() => {handlerClose()})
                        }}>Сохранить</button>
                    </div> 
                    }
                </Box>
            </Modal>
        </div>
    )
}