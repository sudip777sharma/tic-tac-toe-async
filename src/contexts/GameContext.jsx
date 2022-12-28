import { createContext, useContext, useReducer } from "react";
import { AuthContext } from "./AuthContext";

export const GameContext = createContext();

export const GameContextProvider = ({ children }) => {

    const { currentUser } = useContext(AuthContext);

    const INITIAL_STATE = {
        gameId: "null",
        user: {}
    };

    const gameReducer = (state, action) => {
        switch (action.type) {
            case "CHANGE_USER":
                return {
                    ...state,
                    gameId: (currentUser.uid > action.payload.uid ? (currentUser.uid + action.payload.uid) : (action.payload.uid + currentUser.uid)),
                    user: action.payload
                };

            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);

    return (
        <GameContext.Provider value={{ data: state, dispatch }}>
            {children}
        </GameContext.Provider>
    );
}