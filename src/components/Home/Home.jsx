import React, { useEffect, useState } from 'react'
import './Home.scss'
import { Modal, Box } from '@mui/material'
import { useFormik } from 'formik'
import { PostsAPI } from '../api/api'
import axios from 'axios'

export const Home = () => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [posts, setPosts] = useState([])
  const [like, setLike] = useState(false)
  const [likedPosts, setLikedPosts] = useState([])
  const user = JSON.parse(sessionStorage.getItem('user')).login
  useEffect(() => {
    PostsAPI.getPosts().then(e => {setPosts(e.data)})
  }, [])
  useEffect(() => {
    setLikedPosts(JSON.parse(sessionStorage.getItem('likes')))
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
        formData.append('name', user.Username);
        formData.append('surname', user.Surname);
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
      <button className={'createPost'} onClick={handleOpen}>Создать запись</button>
        <div className={'newsline'}>
          {posts? posts.slice().reverse().map(el => {
            return (
              <div className={'post'}>
                <h2>{el.name} {el.surname}</h2>
                <p>{el.description}</p>
                <img src={`http://localhost:7653/images/posts/${el.photo}`} alt={''}/>
                <button onClick={() => {
                    let newLike = []
                    likedPosts?.map(els => {
                      if(els !== el.ID){
                        newLike.push(els)
                      }
                    })
                    setLike(!like)
                    likedPosts?.includes(el.ID)? PostsAPI.unlike(el.ID) : PostsAPI.like(el.ID)
                    likedPosts?.includes(el.ID)
                      ? setLikedPosts(newLike)
                      : setLikedPosts(n => [...n, el.ID]);
                    sessionStorage.setItem('likes', JSON.stringify(likedPosts))
                  }}>
                  <svg fill={likedPosts?.includes(el.ID) ? '#ff0000': '#000000'} height="40px" width="40px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" link="http://www.w3.org/1999/xlink" 
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
