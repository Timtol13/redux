import React, { useEffect, useState } from 'react'
import './Photo.scss'
import { CommentsAPI, authAPI } from '../api/api'
import { Modal, Box } from '@mui/material'
import { Miniature } from '../ProfileMiniature/Miniature';
import { useParams } from 'react-router';
// import { PhotoAPI } from '../api/api';
import StackGrid, { transitions } from "react-stack-grid";
import { Helmet } from 'react-helmet';
import { io } from 'socket.io-client'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    minWidth: '65%',
    maxWidth: '90%',
    maxHeight: '95%',
    minHeight: '55%',
    transform: 'translate(-50%, -50%)',
    bgcolor: '#fff',
    boxShadow: 24,
    borderRadius: 3,
    overflow: 'hidden',
  };

const styleFull = {
    marginTop: '30%',
    marginLeft: '50%',
    height: '80%',
    transform: 'translate(-50%, -50%)',
    bgcolor: '#fff',
    boxShadow: 24,
    borderRadius: 3,
};

const { scaleDown } = transitions;

export const Photo = () => {
    const {login} = useParams()
    const [userPhotoes, setUserPhotoes] = useState([])
    const [filename, setFilename] = useState([])
    const user = JSON.parse(localStorage.getItem('user'))?.login
    useEffect(() => {
        authAPI.getUserPhotoes(login).then((e) => {
            setUserPhotoes(e.data)
        })
    }, [])
    const [open, setOpen] = useState(false)
    const openModal = () => setOpen(true)
    const closeModal = () => setOpen(false)
    const [fullPhoto, setFullPhoto] = useState(false)
    const openFull = () => setFullPhoto(true)
    const closeFull = () => setFullPhoto(false)
    const [imagetoShow, setImageToShow] = useState('')
    const [value, setValue] = useState('')
    const [index, setIndex] = useState(0)
    const [isLiked, setIsLiked] = useState(false)
    const socket = io('http://localhost:5500');

    const [counter, setCounter] = useState()

    const like = (login, likeTo, filename) => {
        socket.emit('likePhoto', {login, likeTo, filename})
        setIsLiked(true)
        setCounter(counter + 1)
    }
    const dislike = (id, login) => {
        socket.emit('dislikePhoto', {id, login})
        setIsLiked(false)
        setCounter(counter - 1)
    }

    useEffect(() => {
        setIsLiked(filename?.like?.includes(login))
        setCounter(filename.like?.length)
    }, [filename, filename?.like])

    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
      
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }
    const sendComment = () => {
        const currentDateTime = new Date();
        const data = {
            'name': user.username,
            'surname': user.surname,
            'message': value,
            'date': formatDate(currentDateTime),
            'login': login,
            'filename': filename?.filename
        }
        CommentsAPI.sendCommentToPhoto(data).then(() => {
            authAPI.getUserPhotoes(login).then(e => {
                setUserPhotoes(e.data); 
                e.data.forEach(el => { 
                    if(el.id === filename.id) setFilename(el)
                })
            })
        })
        setValue('')
    }
    const getMargin = (i) => {
        var marginPrev = 0
        try{
            for(let index = 10; index < userPhotoes.length; index += 5){
                const img = new Image();
                img.src = `http://localhost:7653/images/${login}/${userPhotoes[i-index].filename}`;
                let del = img.width / 150
                if((img.height / del) < 200){
                    marginPrev = (200 - (img.height / del))
                }
            }
        } catch(TypeError){
            console.log('error')
        }
        try{
            const img = new Image();
            img.src = `http://localhost:7653/images/${login}/${userPhotoes[i-5 || i]?.filename}`;
            let del = img.width / 150
            if((img.height / del) < 200){
                return (200 - (img.height / del) + (marginPrev > 0? marginPrev - 50 : 0))
            }
        } catch(err){
            console.error(err)
        }
    } 
  return (
    <div  className={'photoMainDiv'}>
        <Helmet>
          <title>Фото</title>
      </Helmet>
       <StackGrid
            columnWidth={150}
            className={'stackLayout'}
            itemComponent={"div"}
            >
            { 
                userPhotoes? userPhotoes.sort((a, b) => a.id - b.id).map((el, i) => {
                    return (
                        <img key={el.id} style={{ marginTop: `-${getMargin(i)}px` }} onClick={() => {openModal(); setImageToShow(`http://localhost:7653/images/${login}/${el.filename}`); setFilename(el); setIndex(i)}} src={`http://localhost:7653/images/${login}/${el.filename}`}/>
                    )
                }) : ''
            }
        </StackGrid>
        <Modal
            open={open}
            onClose={closeModal}
            >
            <Box sx={style}>
                <div className={'showed'}>
                    <button className='arrow' onClick={() => {
                        try{
                            setFilename(userPhotoes[index-1]); 
                            setImageToShow(`http://localhost:7653/images/${login}/${userPhotoes[index-1].filename}`); 
                            setIndex(index-1)
                        } catch (TypeError){
                            setFilename(userPhotoes[index]); 
                            setImageToShow(`http://localhost:7653/images/${login}/${userPhotoes[index].filename}`); 
                            setIndex(index)
                        }
                    }}>&#060;</button>
                    <div className='showed_img'>
                    <img onClick={openFull} src={imagetoShow}/>
                    </div>
                    <div className={'imageIntaractive'}>
                        <Miniature login={login} />
                        <button onClick={() => {
                            // filename.like?.includes(user.login)
                            isLiked? dislike(filename.id, user.login) : like(login, user.login, userPhotoes[index].filename)
                        }}>
                        <svg fill={isLiked ? '#ff0000': '#000000'} height="40px" width="40px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" link="http://www.w3.org/1999/xlink" 
                            viewBox="0 0 471.701 471.701" >
                        <g>
                            <path d="M433.601,67.001c-24.7-24.7-57.4-38.2-92.3-38.2s-67.7,13.6-92.4,38.3l-12.9,12.9l-13.1-13.1
                            c-24.7-24.7-57.6-38.4-92.5-38.4c-34.8,0-67.6,13.6-92.2,38.2c-24.7,24.7-38.3,57.5-38.2,92.4c0,34.9,13.7,67.6,38.4,92.3
                            l187.8,187.8c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-3.9l188.2-187.5c24.7-24.7,38.3-57.5,38.3-92.4
                            C471.801,124.501,458.301,91.701,433.601,67.001z M414.401,232.701l-178.7,178l-178.3-178.3c-19.6-19.6-30.4-45.6-30.4-73.3
                            s10.7-53.7,30.3-73.2c19.5-19.5,45.5-30.3,73.1-30.3c27.7,0,53.8,10.8,73.4,30.4l22.6,22.6c5.3,5.3,13.8,5.3,19.1,0l22.4-22.4
                            c19.6-19.6,45.7-30.4,73.3-30.4c27.6,0,53.6,10.8,73.2,30.3c19.6,19.6,30.3,45.6,30.3,73.3
                            C444.801,187.101,434.001,213.101,414.401,232.701z"/>
                        </g>
                        </svg>
                        <h3>{counter}</h3>
                        </button>
                        <div className='comments'>
                            <div className={'content'}>
                            {filename?.comments?.map(el => {
                                return (
                                    <div className='message'>
                                        <h3 className='sender'>{JSON.parse(el? el: JSON.stringify(''))?.name} {JSON.parse(el? el: JSON.stringify(''))?.surname}</h3>
                                        <h3 className='senderText'>{JSON.parse(el? el: JSON.stringify(''))?.message}</h3>
                                        <h6 className='senderDate'>{JSON.parse(el? el: JSON.stringify(''))?.date}</h6>
                                    </div>
                                )
                            })}
                            </div>
                            <div className={'inputBar'}>
                                <input
                                    type='text'
                                    id='textbox'
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    onKeyUp={(e) => {
                                    if (e.which === 13) {
                                        sendComment()
                                    }
                                    }}
                                />
                                    <label className="input-file">
                                        <input type="file" name="file" onChange={(e) => {
                                            //upload(e.target.files, e.target.files[0].name)
                                        }}/>		
                                        <span><img src={'/file.png'} width={30} height={30}/></span>
                                    </label>
                                <button id={'btn'} onClick={sendComment}>Отправить</button>
                            </div>
                        </div>
                    </div>
                    <button className='arrow' onClick={() => {
                        try{
                            setFilename(userPhotoes[index+1]); 
                            setImageToShow(`http://localhost:7653/images/${login}/${userPhotoes[index+1].filename}`); 
                            setIndex(index+1)
                        } catch (TypeError){
                            setFilename(userPhotoes[index]); 
                            setImageToShow(`http://localhost:7653/images/${login}/${userPhotoes[index].filename}`); 
                            setIndex(index)
                        }
                        }}>&gt;</button>
                </div>
            </Box>
        </Modal>
        <Modal
            open={fullPhoto}
            onClose={closeFull}
            >
            <Box sx={styleFull}>
                <img className='showed_img' onClick={openFull} src={imagetoShow}/>
            </Box>
        </Modal>
    </div>
  )
}
