import React, { useEffect, useState } from 'react'
import './Home.scss'

export const Home = () => {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    
  }, [])
  return (
    <div className={'homeMainDiv'}>
      <button className={'createPost'}>Создать запись</button>
        <div className={'newsline'}>

        </div>
    </div>
  )
}
