import React, {useContext, useEffect, useRef, useState} from "react";
import {Socket} from "socket.io-client";
import {useNavigate, useParams} from "react-router-dom";
import LobbyPage from "./lobby_page/LobbyPage";
import GamePage from "./game_page/GamePage";
import EndingPage from "./ending_page/EndingPage";
import {Context} from "../../App.tsx";
import {DefaultEventsMap} from "@socket.io/component-emitter";

export enum AppState {
    Lobby = "Lobby",
    Game = "Game",
    GameCountdown = "GameCountdown",
    Ending = "Ending"
}

function OuterTypingRacerPage() {
    const navigate = useNavigate();
    const {userName, setGameId, socketRef} = useContext(Context);
    const { id } = useParams<{ id: string }>();
    const onceRef = useRef(false);
    const [gameAvailable, setGameAvailable] = useState(false);

    useEffect(() => {
        if (userName.length === 0 || !socketRef.current) {
            setGameId(id);
            navigate("/");
        }
    }, [userName, navigate]);

    useEffect(() => {
        if (onceRef.current) {
            return;
        }
        onceRef.current = true;

        if (socketRef.current) {
            socketRef.current.emit("check_game_availability", id);

            socketRef.current.on("game_available", () => setGameAvailable(true));

            socketRef.current.on("game_unavailable", () => {
                setGameId(id);
                navigate("/");
            })
        }
    }, []);

    if (userName.length === 0 || !gameAvailable) {
        return <div></div>;
    } else {
        return <TypingRacerPage/>;
    }
}

function TypingRacerPage() {
    const [userText, setUserText] = useState("");
    const [userCorrectLength, setUserCorrectLength] = useState(0);
    const [socket, setSocket] = useState<Socket | null>(null);
    const onceRef = useRef(false);

    const {
        socketRef,
        userName,
        gameId,
        appState,
        createdGameText,
        setCreatedGameText
    } = useContext(Context);

    useEffect(() => {
        if (onceRef.current) {
            return;
        }
        onceRef.current = true;
        setSocket(socketRef.current);

        generateGameText(socketRef, userName, gameId, setCreatedGameText);
    }, [socketRef]);

    function handleStartGame() {
        if (createdGameText) {
            socket?.emit("start_game", {
                name: userName,
                room: gameId
            });
        }
    }

    function pushCharacter(character: string) {
        setUserText((text) => text + character);
        socket?.emit("push_character", character.charAt(character.length - 1));
    }

    function popCharacter() {
        setUserText((text) => text.substring(0, text.length - 1));
        socket?.emit("pop_character");
    }

    switch (appState) {
        case AppState.Lobby: {
            return <LobbyPage handleStartGame={handleStartGame} />;
        }
        case AppState.GameCountdown: case AppState.Game: {
            return <GamePage
                userId={socket?.id}
                userText={userText}
                pushCharacter={pushCharacter}
                popCharacter={popCharacter}
                userCorrectLength={userCorrectLength}
                setUserCorrectLength={setUserCorrectLength}
            />
        }
        case AppState.Ending: {
            return <EndingPage
                userId={socket?.id}
                userCorrectLength={userCorrectLength}
                setUserCorrectLength={setUserCorrectLength}
                setUserText={setUserText}
            />
        }
    }
}

export function generateGameText(
    socketRef: React.MutableRefObject<Socket<DefaultEventsMap, DefaultEventsMap> | null>,
    userName: string,
    gameId: string | undefined,
    setCreatedGameText: React.Dispatch<React.SetStateAction<boolean>>
) {
    socketRef.current?.emit("generate_game_text", {
        name: userName,
        room: gameId
    });

    socketRef.current?.on("created_game_text", () => {
        setCreatedGameText(true);
    });
}

export default OuterTypingRacerPage;