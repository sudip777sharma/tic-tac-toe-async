import { signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'

import { BsPlusLg } from 'react-icons/bs'
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { GameContext } from '../contexts/GameContext';
import { auth, db } from '../firebase';

import './games.css'
const Games = () => {

    const history = useHistory();
    const [games, setGames] = useState([]);
    const { currentUser } = useContext(AuthContext);
    const { data, dispatch } = useContext(GameContext);

    useEffect(() => {
        const getGames = () => {
            const unsub = onSnapshot(doc(db, "userGames", currentUser.uid), (doc) => {
                setGames(doc.data());
            });
            return () => {
                unsub();
            };
        };

        currentUser.uid && getGames();
    }, [currentUser.uid]);


    const handleNewGameBtn = () => {
        history.push("/searchUser");
    }

    const handlePlayGameBtn = (u) => {
        dispatch({ type: "CHANGE_USER", payload: u });
        history.push("/gameWith");
    }

    function formatDateTime(input) {
        var time = new Date(0);
        time.setSeconds(parseInt(input));
        var date = time.toISOString();
        date = date.replace('T', ' ');
        return date.split('.')[0].split(' ')[0] + ' ' + time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    };

    return (
        <div className="games_page">
            <div className="gamesTitle">
                <h1>Your Games</h1>
                <button className="logout" onClick={() => signOut(auth)} >Logout</button>
            </div>
            {
                games ? (
                    <>
                        <button className='newGame' onClick={handleNewGameBtn}> <BsPlusLg /> New game</button>
                        {
                            Object.entries(games)?.sort((a, b) => b[1].date - a[1].date).map((game) => (
                                // games.map((game, indx) => (
                                <div className='game' key={game[0]}>
                                    <div className="gameWith">
                                        <h1>Game with {game[1].gameInfo.name}</h1>
                                        {
                                            game[1].gameInfo.gameWonBy ? (
                                                <>
                                                    {
                                                        game[1].gameInfo.gameWonBy == 'none' && (<p>It's a draw!</p>)
                                                    }
                                                    {
                                                        currentUser.uid && game[1].gameInfo.gameWonBy == `${currentUser.uid}` && (<p>You won!</p>)
                                                    }
                                                    {
                                                        data.user.uid && game[1].gameInfo.gameWonBy == `${data.user.uid}` && (<p>{game[1].gameInfo.name} won!</p>)
                                                    }
                                                </>
                                            ) : (
                                                <>
                                                    <p>{game[1].gameInfo.turn == 0 ? `${game[1].gameInfo.name} just made their move!` : `you've made your move!`}</p>

                                                    <p>{game[1].gameInfo.turn == 0 ? `It's your turn to play now.` : `Waiting for them.`}</p>
                                                </>
                                            )
                                        }

                                        <p>{formatDateTime(game[1]?.date?.seconds)}</p>


                                        <button className='playGame' onClick={() => handlePlayGameBtn(game[1].gameInfo)} >{game[1].gameInfo.gameWonBy ? `View game` : (game[1].gameInfo.turn == 0) ? `Play!` : `View game`}</button>
                                    </div>
                                </div>
                            ))
                        }
                    </>
                ) : (
                    <>
                        <div className="noGamesFound">
                            No Games Found
                            <button className='startNewGame' onClick={handleNewGameBtn}>Start a new game</button>
                        </div>
                    </>
                )
            }
        </div >
    )
}

export default Games