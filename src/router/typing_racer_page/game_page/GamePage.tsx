import React, {JSX, useContext, useEffect, useState} from "react";
import "./gamePage.css";
import Header from "../../header/Header";
// @ts-ignore
import TextInput from "./components/TextInput.jsx";
import {getLeaderboardElements} from "../../../utils/Leaderboard";
import {Context} from "../../../App.tsx";

interface Props {
    userId: string | undefined,
    userText: string,
    pushCharacter: (text: string) => void,
    popCharacter: () => void,
    userCorrectLength: number,
    setUserCorrectLength: React.Dispatch<React.SetStateAction<number>>
}

function GamePage(
    {
        userId,
        userText,
        pushCharacter,
        popCharacter,
        userCorrectLength,
        setUserCorrectLength
    }: Props
) {
    const [leaderboardElements, setLeaderboardElements] = useState<JSX.Element[] | null>(null);

    const {
        userMap,
        correctTextLengthMap,
        userColorMap,
        gameText,
    } = useContext(Context);

    useEffect(() => {
        setLeaderboardElements(
            getLeaderboardElements(
                userId,
                userMap,
                correctTextLengthMap,
                userColorMap,
                gameText,
                userCorrectLength
            )[0]
        );
    }, [correctTextLengthMap, gameText, gameText.length, userColorMap, userCorrectLength, userId, userMap]);

    return (
        <div className={"game-page"}>
            <Header/>
            <h1 className={"game-title"}>Game Page</h1>
            <h2 className={"leaderboard"}>Leaderboard: </h2>
            <div className={"user-list"}>
                {leaderboardElements}
            </div>
            <TextInput
                userId={userId}
                userText={userText}
                userCorrectLength={userCorrectLength}
                setUserCorrectLength={setUserCorrectLength}
                pushCharacter={pushCharacter}
                popCharacter={popCharacter}
            />
        </div>
    );
}

export default GamePage;