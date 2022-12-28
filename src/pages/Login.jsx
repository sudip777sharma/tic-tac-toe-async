import React, { useState } from 'react'

import './login.css'

import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useHistory } from 'react-router-dom';
const Login = () => {

    const history = useHistory();

    const [err, setErr] = useState('');
    const [logedin, setLogedin] = useState(0);
    // const history = useHistory();

    const handleSubmit = async (e) => {
        setLogedin(1);
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // console.log("sucessfully loged in.");
            history.push("/");
        } catch (error) {
            const errorCode = error.code;
            // console.log(errorCode);
            setErr(errorCode);
        }
    }

    const handleBackBtn = () => {
        history.push("/");
    }

    return (
        <>
            <div className="login_page">
                <div className="navBtn" onClick={handleBackBtn}>
                    <MdOutlineArrowBackIosNew />
                </div>
                <div className="formContainer">
                    <div className="loginTitle">
                        <p style={{ fontWeight: 'bold' }} >Login</p>
                        <h1>Please enter your details</h1>
                    </div>
                    <form className='loginForm' onSubmit={handleSubmit}>

                        <div className='login_ele'>
                            <label style={{ fontWeight: 'bold' }} htmlFor="email">Email</label>
                            <br />
                            <input className='email Input' type="email" placeholder='Type your email here' />
                        </div>

                        <div className='login_ele'>
                            <label style={{ fontWeight: 'bold' }} htmlFor="password">Password</label>
                            <br />
                            <input className='password Input' type="password" placeholder='Type your Password here' />
                        </div>
                        {
                            (err !== '') && <div className="loginRespStatus">Enter correct Details.</div>
                        }
                        <button className='loginBtn'>Login</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login