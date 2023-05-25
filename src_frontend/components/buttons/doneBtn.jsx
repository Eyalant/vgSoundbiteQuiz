import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { SummaryModal } from '../modals/summaryModal.jsx';
import { ConfirmationModal } from '../modals/confirmationModal.jsx';

export function DoneBtn({ setForceRevealAllCards, numOfQuestions }) {
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [doneBtnText, setDoneBtnText] = useState("סיימתי! סכום את הניקוד שלי וחשוף את כל התשובות");
  const [doneConfModalState, setDoneConfModalState] = useState({
    "show": false, "isSolved": false, "returnBtnVariant": "secondary", "text":
      <>
        לסכום את הניקוד ולסיים את המשחק?<br />
        אין אפשרות לענות על שאלות לאחר מכן!
      </>, onConfirm: () => { setDoneConfModalState({ ...doneConfModalState, "show": false, "isSolved": true }); setShowSummaryModal(true); }
  });

  function handleDoneBtn() {
    if (doneConfModalState.isSolved) {
      setShowSummaryModal(true);
    } else {
      setDoneConfModalState({ ...doneConfModalState, "show": true });
    }
  }

  return (
    <>
      <Button data-testid="done-btn" id="done-btn" onClick={() => handleDoneBtn()} className="ms-3" size="lg" variant="success">{doneBtnText}</Button>
      <ConfirmationModal confModalState={doneConfModalState} setConfModalState={setDoneConfModalState} />
      <SummaryModal showSummaryModal={showSummaryModal} setShowSummaryModal={setShowSummaryModal}
        setForceRevealAllCards={setForceRevealAllCards}
        setDoneBtnText={setDoneBtnText} numOfQuestions={numOfQuestions} />
    </>
  );
}