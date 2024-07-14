import React, {useContext, useEffect, useRef, useState} from "react";
import "./styles.css";
import isScrolling from "react-is-scrolling/dist/IsScrolling.js";
import {Context} from "../../../../App";

export function TextInput({userId, userText, userCorrectLength, setUserCorrectLength, pushCharacter, popCharacter, isScrolling}) {
    const divRef = useRef(null);
    const elementRefs = useRef([]);
    const [currentLetterPosition, setCurrentLetterPosition] = useState(0);
    const [focused, setFocused] = useState(false);
    const [enemyCursorList, setEnemyCursorList] = useState([]);
    const [displayedElements, setDisplayedElements] = useState(null);
    const {countdownSeconds} = useContext(Context);
    const [start, setStart] = useState(true);

    const {
        gameText,
        correctTextLengthMap,
        userColorMap,
        userMap
    } = useContext(Context);

    const correctLetterColor = "#D1D0C5";
    const wrongLetterColor = "#CA4754";
    const notTypedLetterColor = "#646669"

    useEffect(() => {
        setCursorPosition(0);
    }, []);

    useEffect(() => {
        function updateCursors() {
            let cursorList = [];

            if (elementRefs.current) {
                for (let [currentUserId, currentCorrectLength] of correctTextLengthMap) {
                    const letterIndex = userCorrectLength > currentCorrectLength ? currentCorrectLength : currentCorrectLength + userText.length - userCorrectLength;

                    if (currentUserId === userId || !elementRefs.current[letterIndex]) {
                        continue;
                    }

                    const letter = elementRefs.current[letterIndex].getBoundingClientRect();
                    const userColor = userColorMap.get(currentUserId);

                    if (userColor !== undefined) {
                        cursorList.push(
                            <div
                                key={currentUserId}
                                style={{
                                    position: "absolute",
                                    top: letter.top + window.scrollY,
                                    left: letter.left - letter.width / 2.0 + window.scrollX,
                                    color: userColor
                                }}
                            >
                                |
                            </div>
                        );
                    }
                }
            }

            setEnemyCursorList(cursorList);
        }

        updateCursors();

        window.addEventListener("resize", updateCursors);

        return () => {
            window.removeEventListener("resize", updateCursors);
        };
    }, [userCorrectLength, correctTextLengthMap, gameText.length, userId, elementRefs, userColorMap, userText.length, displayedElements, isScrolling, userMap]);

    useEffect(() => {
        const spanList = [];

        if (gameText.length === 0) {
            spanList.push(
                <div className={"countdown"}>
                    <p>The game starts in {countdownSeconds}</p>
                </div>
            );
            setDisplayedElements(spanList);
            return;
        }

        if (start) {
            divRef.current.focus();
            setStart(false);
        }

        let wrongLetterIndex = userText.length;
        for (let i = 0; i < userText.length; i++) {
            let color = correctLetterColor;

            if (userText[i] !== gameText[i] || i > wrongLetterIndex) {
                color = wrongLetterColor;

                if (wrongLetterIndex === userText.length) {
                    wrongLetterIndex = i;
                }
            }

            spanList.push(
                <span
                    key={i}
                    style={{color: color}}
                    ref={(el) => { elementRefs.current[i] = el; }}
                >
                    {userText[i]}
                </span>
            );
        }
        setUserCorrectLength(wrongLetterIndex);

        for (let i = wrongLetterIndex; i < gameText.length; i++) {
            spanList.push(
                <span
                    key={i + userText.length - wrongLetterIndex}
                    style={{color: notTypedLetterColor}}
                    ref={(el) => { elementRefs.current[i + userText.length - wrongLetterIndex] = el; }}
                >
                    {gameText[i]}
                </span>
            );
        }

        setDisplayedElements(spanList);
    }, [gameText, setUserCorrectLength, userText, countdownSeconds]);

    function setCursorPosition(position = 0) {
        const el = divRef.current;
        const range = document.createRange();
        const sel = window.getSelection();

        if (el.childNodes.length > 0) {
            const node = el.childNodes[position];
            range.setStart(node, 0);
            range.collapse(true);

            sel.removeAllRanges();
            sel.addRange(range);
        }
    }

    function handleBeforeInput(event) {
        event.preventDefault();
        const isAscii = event.data.charCodeAt(0) <= 127;

        if(!isAscii) {
            return;
        }

        if (currentLetterPosition < gameText.length - 1) {
            setCursorPosition(currentLetterPosition + 1);
            setCurrentLetterPosition((position) => position + 1);
            pushCharacter(event.data);
        } else if (currentLetterPosition === gameText.length - 1) {
            setCurrentLetterPosition((position) => position + 1);
            pushCharacter(event.data);
        }
    }

    function handleKeyDown(event) {
        if (event.key === "Backspace") {
            event.preventDefault();

            if (currentLetterPosition > 0) {
                setCurrentLetterPosition((position) => position - 1);
                setCursorPosition(currentLetterPosition - 1);
                popCharacter();
            }
        } else if (event.key.startsWith("Arrow") || (event.key === "Delete")) {
            event.preventDefault();
        }
    }

    function handleMouseDown(event) {
        if (focused) {
            event.preventDefault();
        }
    }

    return (
        <div className={"text-input-outer"}>
            <div
                className={"text-input"}
                contentEditable={gameText.length !== 0}
                ref={divRef}
                spellCheck={false}
                style={{
                    border: "none",
                    width: "80%"
                }}
                onFocus={() => { setCursorPosition(currentLetterPosition); setFocused(true); }}
                onBlur={() => setFocused(false)}
                onBeforeInput={handleBeforeInput}
                onKeyDown={handleKeyDown}
                onPaste={(event) => event.preventDefault()}
                onDragStart={(event) => event.preventDefault()}
                onDrop={(event) => event.preventDefault()}
                onMouseUp={() => setCursorPosition(currentLetterPosition)}
                onMouseDown={handleMouseDown}
            >
                {displayedElements}
            </div>
            {enemyCursorList}
        </div>
    );
}

export default isScrolling(TextInput);