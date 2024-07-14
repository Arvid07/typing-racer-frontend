import React, {useContext, useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import "./styles.css";
import Header from "../header/Header";
import {io, Socket} from "socket.io-client";
import {GameState} from "../typing_racer_page/TypingRacerPage.tsx";
import {Context, GAME_START_SECONDS} from "../../App.tsx";
import {DefaultEventsMap} from "@socket.io/component-emitter";

interface UserConnectData {
    user_map: { [key: string]: string },
    correct_text_length_map: { [key: string]: number },
    app_state: GameState,
    color: { [key: string]: string }
}

interface UserTextChangeIn {
    user_id: string,
    text_index: number
}

function HomePage() {
    const navigate = useNavigate();
    const onceRef = useRef(false);
    const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
    const [gameUnavailable, setGameUnavailable] = useState(false);
    const [enterUserName, setEnterUserName] = useState(false);
    const [gameCreate, setGameCreate] = useState(false);

    const {
        socketRef,
        userName, setUserName,
        setGameText,
        gameId, setGameId,
        setUserMap,
        setGameState,
        setCorrectTextLengthMap,
        setUserColorMap,
        setCountdownSeconds
    } = useContext(Context);

    useEffect(() => {
        if (onceRef.current) {
            return;
        }
        onceRef.current = true;

        setGameText("");
        setGameState(GameState.LOBBY);
        setUserMap(new Map());
        setCorrectTextLengthMap(new Map());
        setUserColorMap(new Map());
        setCountdownSeconds(GAME_START_SECONDS);

        let socket: Socket<DefaultEventsMap, DefaultEventsMap>;
        if (socketRef.current?.connected) {
            socket = socketRef.current;
            socket.emit("leave_game");
        } else {
            socket = io("ws://localhost:3001");
            socketRef.current = socket;
        }

        setSocket(socket);

        socket.on("user_connect", (userConnectData: UserConnectData) => {
            setUserMap(new Map(Object.entries(userConnectData.user_map)));
            setCorrectTextLengthMap(new Map(Object.entries(userConnectData.correct_text_length_map)));
            setGameState(GameState[userConnectData.app_state as unknown as keyof typeof GameState]);
            setUserColorMap(new Map(Object.entries(userConnectData.color)));
        });

        socket.on("start_game", (gameText: string) => {
            setGameText(gameText);
        });

        socket.on("app_state_change", (newAppState: GameState) => {
            const enumState = GameState[newAppState as unknown as keyof typeof GameState];
            setGameState(enumState);
        });

        socket.on("text_change", (newUserTextLength: UserTextChangeIn) => {
            setCorrectTextLengthMap(prevMap => {
                const updatedMap = new Map(prevMap);
                updatedMap.set(newUserTextLength.user_id, newUserTextLength.text_index);
                return updatedMap;
            });
        });

        socket.on("character_change", (newUserTextLength: UserTextChangeIn) => {
            setCorrectTextLengthMap(prevMap => {
                const updatedMap = new Map(prevMap);
                updatedMap.set(newUserTextLength.user_id, newUserTextLength.text_index);
                return updatedMap;
            });
        });

        socket.on("countdown_change", (seconds) => {
            console.log(seconds);
            setCountdownSeconds(seconds);
        })
    }, []);

    function handleGameJoin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const newGameId = (form.elements.namedItem("gameId") as HTMLInputElement).value;
        setEnterUserName(userName.length === 0);

        socket?.emit("join_game", {
            name: userName,
            room: gameId
        });

        socket?.on("game_unavailable", () => {
            console.log("game_unavailable");
            setGameUnavailable(true);
            return;
        });

        socket?.on("allowed_to_join", () => {
            setGameId(newGameId);
            setGameUnavailable(false);
            navigate(`/${newGameId}`);
        });
    }

    function handleGameCreate() {
        setEnterUserName(userName.length === 0);

        if (userName.length === 0) {
            return;
        }
        setGameCreate(true);

        socket?.emit("create_game", {
            name: userName,
            room: gameId
        });

        socket?.on("game_id", (newGameId: string) => {
            setGameId(newGameId);
            navigate(`/${newGameId}`)
        })
    }

    function displayGameIsUnavailable() {
        if (!gameUnavailable) {
            return null;
        }

        return <p className={"user-error"}>The Game is Unavailable</p>
    }

    function displayNoUserName() {
        if (!enterUserName) {
            return null;
        }

        return <p className={"user-error"}>You have to enter a name</p>
    }

    return (
        <div className={"home-page"}>
            <div className={"header-container"}>
                <Header />
            </div>
            <div className={"input-container"}>
                <div className={"outer"}>
                    <div className={"title"}>Welcome to my Typing Racer!</div>
                    <div className={"input-group"}>
                        <input
                            placeholder={"enter your name"}
                            value={userName}
                            onInput={(input) => {
                                setUserName(input.currentTarget.value);
                                setEnterUserName(input.currentTarget.value.length === 0);
                            }}
                        />
                        <button className={"create-game"} onClick={handleGameCreate} disabled={gameCreate}>Create New Game</button>
                    </div>
                    {displayNoUserName()}
                    <form className={"game-id"} onSubmit={handleGameJoin}>
                        <input
                            placeholder={"enter game id to join"}
                            value={gameId}
                            onInput={(input) => setGameId(input.currentTarget.value)}
                            name={"gameId"}
                        />
                        <button className={"join-button"} type={"submit"}>Join Game</button>
                    </form>
                    {displayGameIsUnavailable()}
                </div>
            </div>
        </div>
    );
}

export default HomePage;