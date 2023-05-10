const root = ReactDOM.createRoot(document.getElementById('root'));
const { useState, useEffect } = React;
var { Card, Button, Col, Row, Container, Form, Navbar, Modal } = ReactBootstrap;

function App() {
    const [isForceRevealAllCards, setForceRevealAllCards] = useState(false);
    const [doneBtnText, setDoneBtnText] = useState("סיימתי!");
    return (
        <>
            <LandingMessage />
            <Buttons location={"beginning"} setForceRevealAllCards={setForceRevealAllCards} doneBtnText={doneBtnText} setDoneBtnText={setDoneBtnText} />
            <GameCardsGrid isForceRevealAllCards={isForceRevealAllCards} />
            <Buttons location={"end"} setForceRevealAllCards={setForceRevealAllCards} doneBtnText={doneBtnText} setDoneBtnText={setDoneBtnText} />
            <a id="bottom"></a>
        </>
    );
}

root.render(<App />);