function GameCardsGrid({numOfQuestions, isForceRevealAllCards}) {
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