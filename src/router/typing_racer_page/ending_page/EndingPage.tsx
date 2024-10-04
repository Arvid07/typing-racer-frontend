import React, {JSX, useContext, useEffect, useState} from "react";
import Header from "../../header/Header";
import "./endingPage.css";
import {getLeaderboardElements} from "../../../utils/Leaderboard";
import {Context, GAME_START_SECONDS} from "../../../App.tsx";
import {useNavigate} from "react-router-dom";
import {generateGameText} from "../TypingRacerPage.tsx";

interface Props {
    userId: string | undefined,
    userCorrectLength: number,
    setUserCorrectLength: React.Dispatch<React.SetStateAction<number>>,
    setUserText: React.Dispatch<React.SetStateAction<string>>
}

function EndingPage({userId, userCorrectLength, setUserCorrectLength, setUserText}: Props) {
    const [leaderboardElements, setLeaderboardElements] = useState<JSX.Element[] | null>(null);
    const [userPlacementElement, setUserPlacementElement] = useState<JSX.Element | null>(null);
    const navigate = useNavigate();

    const {
        userMap,
        correctTextLengthMap,
        gameText,
        userColorMap,
        socketRef,
        userName,
        gameId,
        setGameId,
        setCreatedGameText,
        setCountdownSeconds,
        setGameText
    } = useContext(Context);

    useEffect(() => {
        const newLeaderboardElements = getLeaderboardElements(
            userId,
            userMap,
            correctTextLengthMap,
            userColorMap,
            gameText,
            userCorrectLength
        );

        setLeaderboardElements(newLeaderboardElements[0]);
        setUserPlacementElement(
            <h2 className={"placement"}>Your Placement: {newLeaderboardElements[1]}</h2>
        );
    }, [correctTextLengthMap, gameText, gameText.length, userColorMap, userCorrectLength, userId, userMap]);

    function handlePlayAgain() {
        socketRef.current?.emit("play_again", {
            name: userName,
            room: gameId
        });

        socketRef.current?.on("game_id", (gameId: string) => {
            setGameId(gameId);
            setUserCorrectLength(0);
            setCountdownSeconds(GAME_START_SECONDS);
            setGameText("");
            setUserText("");

            navigate(`/${gameId}`);

            generateGameText(socketRef, userName, gameId, setCreatedGameText);
        });
    }

    return (
        <div className={"ending-page"}>
            <Header />
            <h1 className={"game-title"}>Ending Page</h1>
            {userPlacementElement}
            <h2 className={"leaderboard"}>Leaderboard:</h2>
            <div className={"user-list"}>
                {leaderboardElements}
            </div>
            <button className={"play-again"} onClick={handlePlayAgain}>Play Again</button>
        </div>
    );
}

export default EndingPage;