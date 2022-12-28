import React from 'react'
import { useHistory } from 'react-router-dom'

import './home.css'

const Home = () => {

    const history = useHistory();

    const handleLoginBtn = () => {
        history.push("/login");
    }
    const handleRegisterBtn = () => {
        history.push("/register");
    }

    return (
        <>
            <div className="home">
                <div className="home_title">
                    <h1>async</h1>
                    <h1>tic tac</h1>
                    <h1>toe</h1>
                </div>
                <div className='home_btns'>
                    <button className='home_login home_btn' onClick={handleLoginBtn} >Login</button>
                    <button className='home_register home_btn' onClick={handleRegisterBtn} >Register</button>
                </div>
            </div>
        </>
    )
}

export default Home
