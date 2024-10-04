import React, {useRef, useState} from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import HomePage from "./router/home_page/HomePage";
import {Socket} from "socket.io-client";
import {DefaultEventsMap} from "@socket.io/component-emitter";
import OuterGamePage, {AppState} from "./router/typing_racer_page/TypingRacerPage";

export const GAME_START_SECONDS = 5;

interface ContextType {
    socketRef: React.MutableRefObject<Socket<DefaultEventsMap, DefaultEventsMap> | null>,
    userName: string,
    setUserName: React.Dispatch<React.SetStateAction<string>>,
    gameId: string | undefined,
    setGameId: React.Dispatch<React.SetStateAction<string | undefined>>,
    userMap: Map<string, string>,
    setUserMap: React.Dispatch<React.SetStateAction<Map<string, string>>>,
    appState: AppState,
    setAppState: React.Dispatch<React.SetStateAction<AppState>>,
    gameText: string,
    setGameText: React.Dispatch<React.SetStateAction<string>>,
    createdGameText: boolean,
    setCreatedGameText: React.Dispatch<React.SetStateAction<boolean>>,
    correctTextLengthMap: Map<string, number>,
    setCorrectTextLengthMap: React.Dispatch<React.SetStateAction<Map<string, number>>>,
    userColorMap: Map<string, string>,
    setUserColorMap: React.Dispatch<React.SetStateAction<Map<string, string>>>,
    countdownSeconds: number,
    setCountdownSeconds: React.Dispatch<React.SetStateAction<number>>
}

// @ts-ignore
export const Context = React.createContext<ContextType>();

function App() {
    const [userName, setUserName] = useState("");
    const [gameId, setGameId] = useState<string | undefined>("");
    const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
    const [userMap, setUserMap] = useState<Map<string, string>>(new Map());
    const [appState, setAppState] = useState(AppState.Lobby);
    const [gameText, setGameText] = useState("");
    const [createdGameText, setCreatedGameText] = useState(false);
    const [correctTextLengthMap, setCorrectTextLengthMap] = useState<Map<string, number>>(new Map());
    const [userColorMap, setUserColorMap] = useState<Map<string, string>>(new Map());
    const [countdownSeconds, setCountdownSeconds] = useState(GAME_START_SECONDS);

    return (
        <Context.Provider value={{
            socketRef,
            userName, setUserName,
            gameId, setGameId,
            userMap, setUserMap,
            appState, setAppState,
            createdGameText, setCreatedGameText,
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

export default App;