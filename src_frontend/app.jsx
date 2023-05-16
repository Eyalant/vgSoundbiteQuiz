import { createRoot } from "react-dom/client";
import React, { useState, useEffect } from "react";
import { LandingMessage } from './landingMessage.jsx';
import { Buttons } from './buttons.jsx';
import { GameCardsGrid } from './gameCardsGrid.jsx';
import { InfoBar } from './infoBar.jsx';

const root = createRoot(document.getElementById('root'));

function App() {
    const [numOfQuestions, setNumOfQuestions] = useState(getInitialState());
    const [isForceRevealAllCards, setForceRevealAllCards] = useState(false);
    const [doneBtnText, setDoneBtnText] = useState("סיימתי!");

    useEffect(() => {
        async function getNumberOfQuestions() {
            if (!numOfQuestions) { // get them from server, store in localStorage
                const resp = await fetch("num-ques");
                const quesObj = await resp.json();
                setNumOfQuestions(quesObj.num);
                localStorage.setItem("numOfQuestions", quesObj.num);
            }
        } getNumberOfQuestions();
    }, []);

    function getInitialState() {
        return localStorage.getItem("numOfQuestions");
    }

    return (
        <>
            <LandingMessage />
            <Buttons
                location={"beginning"}
                setForceRevealAllCards={setForceRevealAllCards}
                doneBtnText={doneBtnText}
                setDoneBtnText={setDoneBtnText}
                numOfQuestions={numOfQuestions} />
            <GameCardsGrid numOfQuestions={numOfQuestions} isForceRevealAllCards={isForceRevealAllCards} />
            <Buttons location={"end"}
                setForceRevealAllCards={setForceRevealAllCards}
                doneBtnText={doneBtnText}
                setDoneBtnText={setDoneBtnText}
                numOfQuestions={numOfQuestions} />
            <a id="bottom"></a>
            <br />
            <InfoBar />
        </>
    );
}

root.render(<App />);