import React from 'react'
import { Link, BrowserRouter, useNavigate} from 'react-router-dom'
import styles from './Header.modul.scss'

export const Header = () => {
    const nav = useNavigate()
    const logg = localStorage.getItem('isLoggin')
    const logoutHandler = () => {
        localStorage.setItem('isLoggin', 'false')
        localStorage.setItem('user', JSON.stringify({}))
        window.location.reload()
    }
    const profileHandler = () => {
        nav('/profile')
    }
    return (
        <div>
            <nav className={styles.nav}>
                <div className={styles.ul}>
                    <img src={'logo512.png'} width={70} />
                </div>
                { logg === 'false' ?
                <ul className={styles.ul}>
                    <li> <Link type='button' to='/login'>login</Link></li>
                    <li> <Link type='button' to='/registration'>registration</Link></li>
                </ul>
                : <ul className={styles.ul}>
                        <li><button onClick={logoutHandler} >Log-out</button></li>
                        <li><button onClick={profileHandler}><img src={'profile.png'} width={30}/></button></li>
                    </ul>
                }
            </nav>
        </div>
    )
}