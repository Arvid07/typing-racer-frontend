import React, {useRef, useState} from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import HomePage from "./router/home_page/HomePage";
import {Socket} from "socket.io-client";
import {DefaultEventsMap} from "@socket.io/component-emitter";
import OuterGamePage, {GameState} from "./router/typing_racer_page/TypingRacerPage";
import {useMediaQuery} from "react-responsive";

export const GAME_START_SECONDS = 5;

interface ContextType {
    socketRef: React.MutableRefObject<Socket<DefaultEventsMap, DefaultEventsMap> | null>,
    userName: string,
    setUserName: React.Dispatch<React.SetStateAction<string>>,
    gameId: string | undefined,
    setGameId: React.Dispatch<React.SetStateAction<string | undefined>>,
    userMap: Map<string, string>,
    setUserMap: React.Dispatch<React.SetStateAction<Map<string, string>>>,
    gameState: GameState,
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    gameText: string
    setGameText: React.Dispatch<React.SetStateAction<string>>,
    correctTextLengthMap: Map<string, number>,
    setCorrectTextLengthMap: React.Dispatch<React.SetStateAction<Map<string, number>>>,
    userColorMap: Map<string, string>,
    setUserColorMap: React.Dispatch<React.SetStateAction<Map<string, string>>>,
    countdownSeconds: number,
    setCountdownSeconds: React.Dispatch<React.SetStateAction<number>>
}

// @ts-ignore
export const Context = React.createContext<ContextType>();

function UserJoin() {
    const [userName, setUserName] = useState("");
    const [gameId, setGameId] = useState<string | undefined>("");
    const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
    const [userMap, setUserMap] = useState<Map<string, string>>(new Map());
    const [gameState, setGameState] = useState(GameState.LOBBY);
    const [gameText, setGameText] = useState("");
    const [correctTextLengthMap, setCorrectTextLengthMap] = useState<Map<string, number>>(new Map());
    const [userColorMap, setUserColorMap] = useState<Map<string, string>>(new Map());
    const [countdownSeconds, setCountdownSeconds] = useState(GAME_START_SECONDS);

    return (
        <Context.Provider value={{
            socketRef,
            userName, setUserName,
            gameId, setGameId,
            userMap, setUserMap,
            gameState, setGameState,
            gameText, setGameText,
            correctTextLengthMap, setCorrectTextLengthMap,
            userColorMap, setUserColorMap,
            countdownSeconds, setCountdownSeconds
        }}>
            <BrowserRouter>
                <Routes>
                    <Route path={"/"} element={
                        <HomePage />
                    }/>
                    <Route path={"/:id"} element={
                        <OuterGamePage />
                    }/>
                </Routes>
            </BrowserRouter>
        </Context.Provider>
    );
}

function App() {
    const isDesktop = useMediaQuery({
        query: '(min-width: 800px)'
    })

    return isDesktop ? <UserJoin /> :
        <p style={{color: "white", fontSize: 20, textAlign: "center"}}>Please access the website using a desktop computer.</p>;
}

export default App;