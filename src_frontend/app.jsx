import { createRoot } from "react-dom/client";
import React, { useState, useEffect } from "react";
import { Navbar, Container } from "react-bootstrap";
import { LandingMessage } from './components/landing-and-summary/landingMessage.jsx';
import { DoneBtn } from "./components/buttons/doneBtn.jsx";
import { PageNavBtn } from './components/buttons/pageNavBtn.jsx';
import { GameCardsGrid } from './components/game-card/gameCardsGrid.jsx';
import { InfoBar } from './components/bars/infoBar.jsx'

const elem = document.getElementById("root") || document.createElement("div");
const root = createRoot(elem);

export function App() {
    const [numOfQuestions, setNumOfQuestions] = useState(getInitialState());
    const [isForceRevealAllCards, setForceRevealAllCards] = useState(false);
    const [landingMessage, setLandingMessage] = useState(
        <>
            <span className="fw-bold">ברוכות הבאות וברוכים הבאים!</span>
            <br />
            לפניכם/ן 100 קטעי קול קצרצרים ממשחקים מפורסמים
            בהיסטוריה. חלקם הם אפקטים קוליים, חלקם נעימות רקע
            מוכרות וחלקם ציטוטים נבחרים.
            <br /><br />
            אם זיהיתם/ן משחק,
            פשוט הקלידו את שמו באנגלית (גם שם הסדרה זה בסדר).
            אם התשובה נכונה, המשחק ייחשף והניקוד יתעדכן.
            <br /><br />
            והיי, לא חייבים לענות על הכל בישיבה אחת, הנתונים נשמרים בדפדפן.
            <br /><br />
            אם אתם/ן מתקשים/ות בשאלה מסוימת וסקרנים/ות לגבי התשובה, אפשר לוותר על הניקוד שלה ולחשוף את התשובה מיידית.
            <br />
            כשתסיימו, כדי לסכום את הניקוד ולחשוף בבת אחת את התשובות לכל השאלות, לחצו על "סיימתי!" בתחתית הדף.
            <br /><br />
            בהצלחה &#128151;
        </>
    );

    useEffect(() => {
        async function getNumberOfQuestions() {
            if (!numOfQuestions) { // get them from server, store in localStorage
                const resp = await fetch("num-ques");
                const quesObj = await resp.json();
                setNumOfQuestions(quesObj.num);
                localStorage.setItem("num-of-questions", quesObj.num);
            }
        } getNumberOfQuestions();
    }, []);

    function getInitialState() {
        return localStorage.getItem("num-of-questions");
    }

    return (
        <>
            <LandingMessage message={landingMessage} />
            <GameCardsGrid numOfQuestions={numOfQuestions} isForceRevealAllCards={isForceRevealAllCards} />
            <PageNavBtn location="end" />
            <Navbar className="buttons">
                <Container>
                    <Navbar.Brand className="mx-auto">
                        <PageNavBtn location="end" asIcon={true}></PageNavBtn>
                        <DoneBtn
                            setForceRevealAllCards={setForceRevealAllCards}
                            numOfQuestions={numOfQuestions}
                            setLandingMessage={setLandingMessage} />
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