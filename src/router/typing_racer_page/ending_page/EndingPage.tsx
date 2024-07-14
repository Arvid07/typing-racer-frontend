import {JSX, useContext, useEffect, useState} from "react";
import Header from "../../header/Header";
import "./endingPage.css";
import {getLeaderboardElements} from "../../../utils/Leaderboard";
import {Context} from "../../../App.tsx";

interface Props {
    userId: string | undefined,
    userCorrectLength: number
}

function EndingPage({userId, userCorrectLength}: Props) {
    const [leaderboardElements, setLeaderboardElements] = useState<JSX.Element[] | null>(null);
    const [userPlacementElement, setUserPlacementElement] = useState<JSX.Element | null>(null);

    const {
        userMap,
        correctTextLengthMap,
        gameText,
        userColorMap,
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

    return (
        <div className={"ending-page"}>
            <Header />
            <h1 className={"game-title"}>Ending Page</h1>
            {userPlacementElement}
            <h2 className={"leaderboard"}>Leaderboard: </h2>
            <div className={"user-list"}>
                {leaderboardElements}
            </div>
        </div>
    );
}

export default EndingPage;