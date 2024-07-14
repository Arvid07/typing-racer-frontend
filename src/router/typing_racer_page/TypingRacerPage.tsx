import {useContext, useEffect, useRef, useState} from "react";
import {Socket} from "socket.io-client";
import {useNavigate, useParams} from "react-router-dom";
import LobbyPage from "./lobby_page/LobbyPage";
import GamePage from "./game_page/GamePage";
import EndingPage from "./ending_page/EndingPage";
import {Context} from "../../App.tsx";

export enum GameState {
    LOBBY,
    GAME,
    ENDING
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

    const {socketRef,
        userName,
        gameId,
        gameState,
    } = useContext(Context);

    useEffect(() => {
        setSocket(socketRef.current);
    }, [socketRef]);

    function handleStartGame() {
        socket?.emit("start_game", {
            name: userName,
            room: gameId
        });
    }

    function pushCharacter(character: string) {
        setUserText((text) => text + character);
        socket?.emit("push_character", character.charAt(character.length - 1));
    }

    function popCharacter() {
        setUserText((text) => text.substring(0, text.length - 1));
        socket?.emit("pop_character");
    }

    switch (gameState) {
        case GameState.LOBBY: {
            return <LobbyPage handleStartGame={handleStartGame} />;
        }
        case GameState.GAME: {
            return <GamePage
                userId={socket?.id}
                userText={userText}
                pushCharacter={pushCharacter}
                popCharacter={popCharacter}
                userCorrectLength={userCorrectLength}
                setUserCorrectLength={setUserCorrectLength}
            />
        }
        case GameState.ENDING: {
            return <EndingPage userId={socket?.id} userCorrectLength={userCorrectLength} />
        }
    }
}

export default OuterTypingRacerPage;