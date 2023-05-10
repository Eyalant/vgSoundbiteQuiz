function GameCardsGrid({isForceRevealAllCards}) {
    const [numOfQuestions, setNumOfQuestions] = useState(getInitialState());
    
    useEffect(() => {
        async function getNumberOfQuestions() {
            if (!numOfQuestions) { // get them from server, store in localStorage
                const resp = await fetch("ques");
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
        <Container id="game-cards-grid-container">
            <Row xs={1} md={4} className="g-2">
                {
                    Array.from({ length: numOfQuestions }, (_, i) => `q${i + 1}`).map((ques, idx) => (
                        <Col>
                            <GameCard ques={ques} isForceRevealAllCards={isForceRevealAllCards} />
                        </Col>
                    ))
                }
            </Row>
        </Container>
    );
}