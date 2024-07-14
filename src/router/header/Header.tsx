import "./styles.css";
import {Link} from "react-router-dom";

function Header() {
    return (
        <div className={"container"}>
            <div className={"header"}>
                <img src={"/Keyboard-icon.png"} alt={"icon"} className={"icon"}/>
                <p className={"navigation"}>Typing Racer</p>
                <p className={"navigation"}>|</p>
                <Link className={"navigation"} to={"/"}>Home</Link>
            </div>
            <hr className={"header-line"}/>
        </div>
    );
}

export default Header;