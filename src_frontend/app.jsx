import { createRoot } from "react-dom/client";
import React, { useState, useEffect } from "react";
import { Navbar, Container } from "react-bootstrap";
import { LandingMessage } from './landingMessage.jsx';
import { DoneBtn } from "./doneBtn.jsx";
import { PageNavBtn } from './pageNavBtn.jsx';
import { GameCardsGrid } from './gameCardsGrid.jsx';
import { InfoBar } from './infoBar.jsx';

const root = createRoot(document.getElementById('root'));

function App() {
    const [numOfQuestions, setNumOfQuestions] = useState(getInitialState());
    const [isForceRevealAllCards, setForceRevealAllCards] = useState(false);

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
            <GameCardsGrid numOfQuestions={numOfQuestions} isForceRevealAllCards={isForceRevealAllCards} />
            <PageNavBtn location="end" />
            <Navbar className="buttons">
                <Container>
                    <Navbar.Brand className="mx-auto">
                        <PageNavBtn location="end" asIcon={true}></PageNavBtn>
                        <DoneBtn setForceRevealAllCards={setForceRevealAllCards} numOfQuestions={numOfQuestions} />
                    </Navbar.Brand>
                </Container>
            </Navbar>
            <a id="bottom"></a>
            <br />
            <InfoBar />
        </>
    );
}

root.render(<App />);