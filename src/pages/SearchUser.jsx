import React, { useContext, useState } from 'react'

import './searchUser.css';

import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { GameContext } from '../contexts/GameContext';
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';

import { TiTick } from 'react-icons/ti'

const SearchUser = () => {

    const history = useHistory();

    const { currentUser } = useContext(AuthContext);
    const { dispatch } = useContext(GameContext);

    const [emailForSearch, setEmailForSearch] = useState("");
    const [user, setUser] = useState(null);
    const [err, setErr] = useState('');

    const handleSerach = async () => {
        try {
            setErr('');
            const q = query(collection(db, "users"), where("email", "==", emailForSearch));

            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {
                setUser(doc.data());
            });
        } catch (err) {
            setErr(err.code);
        }
    }

    const handleKey = (e) => {
        e.code === "Enter" && handleSerach();
    }

    const handleStartNewGame = async (user) => {
        const combinedId = currentUser.uid > user.uid ? (currentUser.uid + user.uid) : (user.uid + currentUser.uid);
        const userTurn = Math.round(Math.random());
        const currentUserTurn = (userTurn) ? 0 : 1;
        try {
            const res = await getDoc(doc(db, "games", combinedId));
            if (!res.exists()) {
                const gridObj = {
                    0: '',
                    1: '',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: '',
                    7: '',
                    8: '',
                }
                await setDoc(doc(db, "games", combinedId), {
                    [currentUser.uid]: gridObj,
                    [user.uid]: gridObj,
                });

                // create user chats
                await updateDoc(doc(db, "userGames", currentUser.uid), {
                    [combinedId + ".gameInfo"]: {
                        uid: user.uid,
                        name: user.name,
                        turn: userTurn,
                        gameWonBy: '',
                    },
                    [combinedId + ".date"]: serverTimestamp()
                });

                await updateDoc(doc(db, "userGames", user.uid), {
                    [combinedId + ".gameInfo"]: {
                        uid: currentUser.uid,
                        name: currentUser.displayName,
                        turn: currentUserTurn,
                        gameWonBy: '',
                    },
                    [combinedId + ".date"]: serverTimestamp()
                });
            }
            dispatch({ type: "CHANGE_USER", payload: user })
            history.push("/");
        } catch (err) {
        }
        setUser(null);
        setEmailForSearch("");
    }

    const handleBackBtn = () => {
        history.push("/");
    }

    return (
        <div className="searchUser_page">
            <div className="navBtn" onClick={handleBackBtn}>
                <MdOutlineArrowBackIosNew />
            </div>
            <div className="searchUserFormContainer">
                <div className="searchUserTitle">
                    <p style={{ fontWeight: 'bold' }} >Start a new game</p>
                    <h1>Whom do you want to play with?</h1>
                </div>

                <div className='searchEmail'>
                    <label style={{ fontWeight: 'bold' }} htmlFor="email">Email</label>
                    <br />
                    <input className='email Input' type="text" placeholder='Type their Email here' onKeyDown={handleKey} onChange={e => setEmailForSearch(e.target.value)} value={emailForSearch} />
                    <div className="searchStatusBtn">
                        {
                            (user) && <TiTick style={{ backgroundColor: 'green', color: 'white', borderRadius: '50%', fontSize: '30px', margin: '1rem' }} />
                        }
                        <button className="searchUser" onClick={handleSerach}>Search user</button>
                    </div>
                </div>
                {
                    (user) && <button className="startGame" onClick={() => handleStartNewGame(user)} >Start game</button>
                }

            </div>
        </div>
    )
}

export default SearchUser