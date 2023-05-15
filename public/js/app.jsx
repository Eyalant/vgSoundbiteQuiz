const root = ReactDOM.createRoot(document.getElementById('root'));
const { useState, useEffect } = React;
var { Card, Button, Col, Row, Container, Form, Navbar, Modal, Popover, OverlayTrigger } = ReactBootstrap;

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
            <InfoBar id="info-bar" />
        </>
    );
}

root.render(<App />);