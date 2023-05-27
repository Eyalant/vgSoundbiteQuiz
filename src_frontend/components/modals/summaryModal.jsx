import React, { useState, useEffect } from "react";
import { Modal, Container, Button } from "react-bootstrap";
import { ScoreIcons } from '../landing-and-summary/scoreIcons.jsx';

export function SummaryModal({
  showSummaryModal,
  setShowSummaryModal,
  setForceRevealAllCards,
  setDoneBtnText,
  setLandingMessage,
  numOfQuestions }) {
  const handleClose = () => setShowSummaryModal(false);
  const [score, setScore] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  const [revealAllBtnState, setRevealAllBtnState] = useState(
    { "isSolved": false, "text": "לחזור ולחשוף תשובות", "variant": "primary" });

  useEffect(() => {
    const updateScore = async () => {
      if (isSolved) {
        await fetch("clear");
        return;
      };
      if (showSummaryModal) {
        setIsSolved(true);  // user popped up the summary modal
      };
      const resp = await fetch("score");
      const scoreObj = await resp.json();
      setScore(scoreObj.score);
    }; updateScore();
  });

  async function revealAllAnswers() {
    handleClose();
    location.hash = "#top";
    if (!revealAllBtnState.isSolved) {
      setForceRevealAllCards(true);
      setDoneBtnText("חזרה לסיכום");
      setLandingMessage(
        <span>מקווה שנהניתם/ן! כל התשובות מופיעות למטה. בעת רענון של הדף, המשחק יתחיל מההתחלה.</span>
      );
      setRevealAllBtnState({ "isSolved": true, "text": "חזור", "variant": "secondary" });
    }
  }

  async function startOver() {
    await fetch("clear");
    window.location.reload();
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
          <span className="fw-bold">שתפ/י את התוצאה בטוויטר, או את הדף בפייסבוק:</span>
          <a role="share-icon" className="share-icon" href={`https://twitter.com/intent/tweet?text=ווהו%2C%20הצלחתי%20לזהות%20${score}%20מתוך%20${numOfQuestions}%20משחקים%20בחידון%20קטעי%20הקול%21%0Aמוזמנות%20ומוזמנים%20לנסות%20גם%3A%20game-sounds.quest%20👾🔈`} target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-twitter" viewBox="0 0 16 16">
              <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
            </svg>
          </a>
          <a role="share-icon" className="share-icon" href="https://www.facebook.com/sharer/sharer.php?u=game-sounds.quest" target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-facebook" viewBox="0 0 16 16">
              <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"></path>
            </svg>
          </a>
          <br /><br />
          <span>
            זהו, המשחק הסתיים! תוכלו לחשוף את כל התשובות, או להתחיל מההתחלה באמצעות
            לחיצה על הכפתור האדום או רענון של הדף.
          </span>
          <br /><br />
          <Button data-testid="revealall-btn" className="summary-modal-btn" variant={revealAllBtnState.variant} onClick={() => revealAllAnswers()}>{revealAllBtnState.text}</Button>
          <Button data-testid="refresh-page-btn" className="ms-3 summary-modal-btn" variant="danger" onClick={async () => await startOver()}>לרפרש ולנסות מההתחלה</Button>
        </Container>
      </Modal.Body>
    </Modal >
  );
}