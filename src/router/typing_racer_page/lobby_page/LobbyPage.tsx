import {JSX, useContext} from "react";
import "./lobbyPage.css";
import Header from "../../header/Header";
import {Context} from "../../../App.tsx";

interface Props {
    handleStartGame: () => void
}

function LobbyPage({handleStartGame}: Props) {
    const {
        userColorMap,
        userMap,
        createdGameText
    } = useContext(Context);

    function getUserList() {
        const listItems: JSX.Element[] = [];

        let i = 0;
        userMap.forEach((name, key) => {
            const color = userColorMap.get(key);

            if (color !== undefined) {
                listItems.push(
                    <div className={"user-placement"} key={i}>
                        <div
                            className={"user-color"}
                            style={{
                                background: color,
                                marginRight: "5px",
                                width: "20px",
                                height: "20px"
                            }}
                        />
                        <p>{name}</p>
                    </div>
                );
            }
            i++;
        });

        return listItems;
    }

    return (
        <div className={"lobby-page"}>
            <Header />
            <h1 className={"lobby-title"}>Lobby Page</h1>
            <h2 className={"lobby-title"}>Online Users: </h2>
            <div className={"user-list"}>
                {getUserList()}
            </div>
            <button disabled={!createdGameText} onClick={handleStartGame}>Start Game</button>
        </div>
    );
}

export default LobbyPage;