import {JSX} from "react";

export function getLeaderboardElements(
    userId: string | undefined,
    userMap: Map<string, string>,
    correctTextLengthMap: Map<string, number>,
    userColorMap: Map<string, string>,
    gameText: string,
    userCorrectLength: number
): [JSX.Element[], number] {
    const listItems: JSX.Element[] = [];
    let lastIndex = -1;
    let lastPlacement = 0;
    let userPlacementNumber = -1;

    const correctTextLengthMapClone = new Map(correctTextLengthMap);
    if (userId) {
        correctTextLengthMapClone.set(userId, userCorrectLength);
    }
    const leaderboard = [...correctTextLengthMapClone.entries()].sort((a, b) => b[1] - a[1]);

    leaderboard.forEach((entry) => {
        const currentUserId = entry[0];
        const currentCorrectLength = entry[1];
        const gameTextLength = gameText.length !== 0 ? gameText.length : 1;

        if (currentCorrectLength !== lastIndex) {
            lastPlacement += 1;
        }
        if (userId === currentUserId) {
            userPlacementNumber = lastPlacement;
        }

        lastIndex = currentCorrectLength;

        const userName = userMap.get(currentUserId);
        const color = userColorMap.get(currentUserId);
        const userPlacement = <span id={currentUserId + "placement"}
                                    style={{color: "#E0E0E0"}}>{lastPlacement + "."}</span>;
        const userEntry = userName + ": " + Math.round(currentCorrectLength / gameTextLength * 1000) / 10 + "%";
        const dash = <span id={currentUserId + "dash"} style={{color: "black", fontWeight: "bold"}}>{" - "}</span>

        if (userName !== undefined && color !== undefined) {
            let placementElement;

            if (userId !== currentUserId) {
                placementElement =
                    <span id={currentUserId}>
                        {userPlacement}
                        {dash}
                        {userEntry}
                </span>;
            } else {
                placementElement =
                    <span id={currentUserId}>
                        {userPlacement}
                        {dash}
                        {userEntry}
                        <span id={currentUserId + "(you)"} style={{color: "gold"}}>{" (you)"}</span>
                </span>;
            }

            listItems.push(
                <div className={"user-placement"} key={currentUserId + "o"}>
                    <div
                        className={"user-color"}
                        style={{
                            background: color,
                            marginRight: "5px",
                            width: "20px",
                            height: "20px"
                        }}
                    />
                    {placementElement}
                </div>
            );
        }
    });

    return [listItems, userPlacementNumber];
}