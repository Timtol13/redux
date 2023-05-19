import React from 'react' 
import './Messenger.modul.scss'

export const Messenger = () => {
    let messages = [
        {'user': 'danila', 'lastMessage': 'See you tomorrow!', 'date': '24.03.2023'}, 
        {'user': 'tima', 'lastMessage': 'i send you this font', 'date': '30.03.2023'}
    ]
    return (
        <div className={'allMessages'}>
            {messages.map(mes => {
                return (
                    <a href={`/chat/${mes.user}`} className={'message'}>
                        <h3>{mes.user}</h3>
                        <h5>{mes.lastMessage} {mes.date}</h5>
                    </a>
                )
            })}
        </div>
    )
}