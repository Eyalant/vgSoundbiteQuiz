function SummaryModal({ showSummaryModal, setShowSummaryModal, setForceRevealAllCards, setDoneBtnText }) {
  const handleClose = () => setShowSummaryModal(false);
  const [score, setScore] = useState(0);
  const [showRevealAllBtn, setShowRevealAllBtn] = useState("visible");

  async function getLatestScore() {
    const resp = await fetch("score");
    const scoreObj = await resp.json();
    setScore(scoreObj.score);
  } getLatestScore();

  async function revealAllAnswers() {
    setDoneBtnText("בחזרה לסיכום");
    setForceRevealAllCards(true);
    setShowRevealAllBtn("invisible");
    handleClose();
  }

  return (
    <Modal
      id="summary-modal" size="lg" centered
      show={showSummaryModal}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <p className="fw-bold">
          הצלחת לזהות {score} מתוך 100 קטעי קול!
        </p>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Button className={showRevealAllBtn} variant="outline-info" onClick={() => revealAllAnswers()}>חזור וחשוף תשובות</Button>
          <Button className="ms-3" variant="outline-danger" onClick={() => window.location.reload()}>רפרש ונסה שוב</Button>
        </Container>
      </Modal.Body>
    </Modal>
  );
}