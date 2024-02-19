import React, { useEffect, useState } from 'react'
import './Home.scss'
import { Modal, Box } from '@mui/material'
import { useFormik } from 'formik'
import { PostsAPI, authAPI } from '../api/api'
import axios from 'axios'
import {Helmet} from "react-helmet";
import { io } from 'socket.io-client'

export const Home = () => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [posts, setPosts] = useState([])
  const [likedPosts, setLikedPosts] = useState([])
  const user = JSON.parse(localStorage.getItem('user')).login
  const socket = io('ws://localhost:7653');

  useEffect(() => {
    PostsAPI.getPosts().then(e => {setPosts(e.data)})
  }, [])

  socket.on('newLike', (data) => {
    PostsAPI.getPosts().then(e => {setPosts(e.data)})
  })

  const like = (id, login) => {
    socket.emit('likePost', {'id': id, 'login': login})
  }
  const dislike = (id, login) => {
    socket.emit('dislikePost', {'id': id, 'login': login})
  }
  useEffect(() => {
    posts?.map(el => {
      if(el.like.includes(user.login)) setLikedPosts(prev => [...prev, el.id])
    })
  }, [posts])
  const formik = useFormik(
    {
      initialValues: {
        description: '',
        photo: null
      },
      onSubmit: async values => {
        const formData = new FormData();
        formData.append('login', user.login);
        formData.append('name', user.username);
        formData.append('surname', user.surname);
        formData.append('description', values.description);
        formData.append('photo', values.photo);

        try {
          await axios.post('http://localhost:7653/createPost', formData);
          console.log('Запись успешно отправлена на сервер.');
        } catch (error) {
          console.error('Ошибка при отправке записи:', error);
        }
        handleClose()
        window.location.reload()
      }
    }
  )

  return (
    <div className={'homeMainDiv'}>
      <Helmet>
          <title>Новости</title>
      </Helmet>
        <div className={'newsline'}>
        <button className={'createPost'} onClick={handleOpen}>Создать запись</button>
          {posts? posts?.sort((a, b) => a.id - b.id).map(el => {
            authAPI.getUser(el.login).then((e) => {
              // setName(e.data[0].username)
              // setSurname(e.data[0].surname)
            })
            console.log(el.photo)
            return (
              <div className={'post'}>
                <h2>{el.name} {el.surname}</h2>
                <p>{el.description}</p>
                <img src={`http://localhost:7653/images/posts/${el.photo}`} alt={''}/>
                <button onClick={() => {
                    el.like?.includes(user.login)? dislike(el.id, user.login) : like(el.id, user.login)
                  }}>
                  <svg fill={el.like?.includes(user.login) ? '#ff0000': '#000000'} height="40px" width="40px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" link="http://www.w3.org/1999/xlink" 
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
                  <h3>{el.like.length}</h3>
                </button>
              </div>
            )
          }) : ''}
        </div>
        <Modal
          open={open}
          onClose={handleClose}>
          <Box className={'modal'}>
            <form onSubmit={formik.handleSubmit}>
              <h1>Создать запись</h1>
              <textarea placeholder='Описание' className='postDescription' {...formik.getFieldProps('description')}></textarea>
              <div className={'files'}>
                <label className={'input_file'} htmlFor="button-photo">
                    <span>+</span>
                    <input type="file"
                           accept="image/*"
                           className={'files'}
                           id="button-photo"
                           onChange={(event) => {
                            formik.setFieldValue('photo', event.currentTarget.files[0]);
                          }}
                           />
                </label>
              </div>
              <button type='submit' className={'submBtn'}>Создать</button>
            </form>
          </Box>
        </Modal>
    </div>
  )
}
