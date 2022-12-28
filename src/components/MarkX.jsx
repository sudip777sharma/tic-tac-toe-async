import React, { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext';
import { GameContext } from '../contexts/GameContext';

const MarkX = ({ cell, indx }) => {

    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(GameContext);

    return (
        <div>MarkX</div>
        /*  {
                (cell == 'x') && (< Cross className='cross' />)
            }
            {
                (cell == 'o') && (<Circle className='circle' />)
            } 
        */
    )
}

export default MarkX