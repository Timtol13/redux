import React from 'react'
import './Settings.modul.scss'
import { Helmet } from 'react-helmet'
import { gptAPI } from '../api/api'

export const Settings = () => {
  return (
    <div className={'settings_container'}>
        <Helmet>
            <title>Настройки</title>
        </Helmet>
        <h1>GPT сервисы🌟</h1>
        <input onChange={(e) => {gptAPI.requestToChat(e.target.value)}}/>
    </div>
  )
}
