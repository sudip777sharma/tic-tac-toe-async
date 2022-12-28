import React, { useContext, useEffect, useState } from 'react'

import './gameWith.css'

import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import Cross from '../components/Cross';
import Circle from '../components/Circle';
import { useHistory } from 'react-router-dom';
import { GameContext } from '../contexts/GameContext';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthContext } from '../contexts/AuthContext';
import MarkX from '../components/MarkX';

const GameWith = () => {

    const history = useHistory();

    const { currentUser } = useContext(AuthContext);
    const { data, dispatch } = useContext(GameContext);

    const handleBackBtn = () => {
        history.push("/");
    }

    const [grid, setGrid] = useState([]);
    const [userTurn, setUserTurn] = useState(-1);
    const [wonUser, setWonUser] = useState('');

    const wdl = (grid) => {
        const checkerArr = ['012', '345', '678', '036', '147', '258', '048', '246']
        var won = 0;
        for (let i = 0; i < 8; i++) {
            let checkerStr = checkerArr[i];
            let cellInd1 = checkerStr[0] - '0';
            let cellInd2 = checkerStr[1] - '0';
            let cellInd3 = checkerStr[2] - '0';
            if (grid[cellInd1] == 'x' && grid[cellInd1] == grid[cellInd2] && grid[cellInd2] == grid[cellInd3]) {
                won = 1;
                break;
            }
        }
        return won;
    }

    const isAllCellFilled = (grid) => {
        for (let i = 0; i < 9; i++) {
            if (grid[i] == '')
                return 0;
        }
        return 1;
    }

    useEffect(() => {
        const unsub = () => {
            data.gameId && onSnapshot(doc(db, "games", data.gameId), (doc) => {
                var gameData = doc.data();
                if (gameData) {
                    gameData = gameData[currentUser.uid];
                    setGrid(gameData);
                }
            });
        }
        const unsub1 = () => {
            currentUser.uid && onSnapshot(doc(db, "userGames", currentUser.uid), (doc) => {
                var userGame = doc.data();
                var gameInfo = userGame[data.gameId]?.gameInfo;
                if (gameInfo != null && gameInfo?.turn == 0 || gameInfo?.turn == 1) {
                    var turn = gameInfo.turn;
                    setUserTurn(turn);
                }
            });
        }

        const checkWhoWon = () => {
            currentUser.uid && data.gameId && data.user.uid && onSnapshot(doc(db, "games", data.gameId), (doc) => {
                const grids = doc.data();
                const uGrid = grids[data.user.uid];
                const cuGrid = grids[currentUser.uid];
                if (wdl(uGrid)) {
                    setWonUser(data.user.uid);
                } else {
                    if (wdl(cuGrid)) {
                        setWonUser(currentUser.uid);
                    } else {
                        if (isAllCellFilled(uGrid) && isAllCellFilled(cuGrid)) {
                            setWonUser("none");
                        } else {
                            setWonUser('');
                        }
                    }
                }

            })
        }

        return () => {
            unsub();
            unsub1();
            checkWhoWon();
        }
    }, [data.user])


    useEffect(() => {
        const setWhoWon = async () => {
            if (wonUser != '') {
                await updateDoc(doc(db, "userGames", currentUser.uid), {
                    [data.gameId + '.gameInfo.gameWonBy']: wonUser,
                })
                await updateDoc(doc(db, "userGames", data.user.uid), {
                    [data.gameId + '.gameInfo.gameWonBy']: wonUser,
                })
            }
        }

        return () => {
            setWhoWon();
        }

    }, [wonUser]);

    const handleStartAnotherGame = async () => {
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
        await updateDoc(doc(db, "games", data.gameId), {
            [currentUser.uid]: gridObj
        });

        await updateDoc(doc(db, "games", data.gameId), {
            [data.user.uid]: gridObj
        });

        await updateDoc(doc(db, "userGames", currentUser.uid), {
            [data.gameId + '.gameInfo.gameWonBy']: '',
        });

        await updateDoc(doc(db, "userGames", data.user.uid), {
            [data.gameId + '.gameInfo.gameWonBy']: '',
        });
    }

    const clickToMarkX = async (grid, cell, indx) => {
        if (cell[1] == '' && userTurn == 0 && wonUser == '') {
            const cuTurn = userTurn;
            const uTurn = userTurn == 0 ? 1 : 0;

            dispatch({
                type: "CHANGE_USER", payload: {
                    ...data.user,
                    turn: uTurn,
                }
            });
            await updateDoc(doc(db, "games", data.gameId), {
                [currentUser.uid + `.${indx}`]: 'x'
            });

            await updateDoc(doc(db, "games", data.gameId), {
                [data.user.uid + `.${indx}`]: 'o'
            });

            await updateDoc(doc(db, "userGames", currentUser.uid), {
                [data.gameId + '.gameInfo.turn']: uTurn
            });

            await updateDoc(doc(db, "userGames", data.user.uid), {
                [data.gameId + '.gameInfo.turn']: cuTurn
                // {
                //     name: currentUser.name,
                //     gameWonBy: "",
                //     turn: cuTurn,
                //     uid: currentUser.uid,
                // }
            });
        }
    }

    return (
        <div className='gameWith_page'>
            <div className="navBtn" onClick={handleBackBtn}>
                <MdOutlineArrowBackIosNew />
            </div>
            <div className="gameWithContainer">
                <div className="gameWithInfo">
                    <h1>Game with {data?.user?.name}</h1>
                    <p>Your piece</p>
                    <Cross className='cross' />
                </div>
                <div className="gameWithGridContainer">
                    <div className="gameStatus">
                        <p>{wonUser == '' ? (userTurn == 0 ? `Your move` : `Their move`) : (
                            wonUser == 'none' ? `It's a draw!` : (
                                wonUser == `${currentUser.uid}` ? `You won!` : `${data.user.name} won!`
                            )
                        )}</p>
                    </div>
                    <div className="grid">
                        {
                            grid && Object.entries(grid).map((cell, indx) => (
                                <div className="cell" key={indx} onClick={() => clickToMarkX(grid, cell, indx)} >
                                    {
                                        (cell[1] == 'x') && (< Cross className='cross' />)
                                    }
                                    {
                                        (cell[1] == 'o') && (<Circle className='circle' />)
                                    }
                                </div>
                            ))
                        }
                    </div>
                    {
                        wonUser != '' && (<button className="submitTurn" onClick={handleStartAnotherGame}>Start another game</button>)
                    }
                </div>
            </div>
        </div>
    )
}

export default GameWith