function SummaryModal({ showSummaryModal, setShowSummaryModal, setForceRevealAllCards, setDoneBtnText, numOfQuestions }) {
  const handleClose = () => setShowSummaryModal(false);
  const [score, setScore] = useState(0);
  const [revealAllBtnState, setRevealAllBtnState] = useState({ "isSolved": false, "text": "חזור וחשוף תשובות", "variant": "info" });

  async function getLatestScore() {
    const resp = await fetch("score");
    const scoreObj = await resp.json();
    setScore(scoreObj.score);
  } getLatestScore();

  async function revealAllAnswers() {
    handleClose();
    if (!revealAllBtnState.isSolved) {
      setForceRevealAllCards(true);
      setDoneBtnText("בחזרה לסיכום");
      setRevealAllBtnState({ "isSolved": true, "text": "חזור", "variant": "secondary" });
    }
  }

  return (
    <Modal
      id="summary-modal" size="lg" centered
      show={showSummaryModal}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header>
        <p className="fw-bold">
          {score == 0 ? 'אוי,' : 'ווהו!'} הצלחת לזהות {score} מתוך 100 קטעי קול!
        </p>
        <ScoreIcons score={score} numOfQuestions={numOfQuestions} />
      </Modal.Header>
      <Modal.Body>
        <Container className="text-center">
          <Button variant={revealAllBtnState.variant} onClick={() => revealAllAnswers()}>{revealAllBtnState.text}</Button>
          <Button className="ms-3" variant="danger" onClick={() => window.location.reload()}>רפרש ונסה שוב</Button>
        </Container>
      </Modal.Body>
    </Modal>
  );
}