import React, { useContext, useState } from 'react'

import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import './register.css'
import { AuthContext } from '../contexts/AuthContext';
import { useHistory } from 'react-router-dom';

const Register = () => {

    const history = useHistory();

    const { currentUser } = useContext(AuthContext);

    const [err, setErr] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        var name = e.target[0].value;
        const username = e.target[1].value;
        const email = e.target[2].value;
        const password = e.target[3].value;
        name = name?.toLowerCase();
        // console.log(name);
        // console.log(username);
        // console.log(email);
        // console.log(password);

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            // console.log(res);
            const user = res.user;

            await updateProfile(res.user, {
                displayName: name,
                username,
            });
            await setDoc(doc(db, "users", res.user.uid), {
                uid: res.user.uid,
                name,
                username,
                email,
            });
            await setDoc(doc(db, "userGames", res.user.uid), {});
            // history.push("/login");
            // console.log(res.user);
        } catch (error) {
            const errorCode = error.code;
            setErr(errorCode);
            // console.log(errorCode);
        }
    }

    const handleBackBtn = () => {
        history.push("/");
    }

    return (
        <>
            <div className="register_page">
                <div className="navBtn" onClick={handleBackBtn}>
                    <MdOutlineArrowBackIosNew />
                </div>
                <div className="formContainer">
                    <div className="registerTitle">
                        <p style={{ fontWeight: 'bold' }} >Create account</p>
                        <h1>Let's get to know </h1>
                        <h1>you better!</h1>
                    </div>
                    <form onSubmit={handleSubmit} className='registerForm'>
                        <div className='registerForm_ele'>
                            <label style={{ fontWeight: 'bold' }} htmlFor="name">Your name</label>
                            <br />
                            <input className='name Input' type="text" placeholder='Type your name here' />
                        </div>

                        <div className='registerForm_ele'>
                            <label style={{ fontWeight: 'bold' }} htmlFor="username">Username</label>
                            <br />
                            <input className='username Input' type="text" placeholder='Type your Username here' />
                        </div>

                        <div className='registerForm_ele'>
                            <label style={{ fontWeight: 'bold' }} htmlFor="email">Email</label>
                            <br />
                            <input className='email Input' type="email" placeholder='Type your Email here' />
                        </div>

                        <div className='registerForm_ele'>
                            <label style={{ fontWeight: 'bold' }} htmlFor="password">Password</label>
                            <br />
                            <input className='password Input' type="password" placeholder='Type your Password here' />
                        </div>
                        {
                            (err === '' && currentUser) && (<div className="registerRespStatus">Congratulation!!! Account created</div>)
                        }
                        <button className='registerBtn'>Register</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Register
