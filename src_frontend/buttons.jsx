import React, { useState } from "react";
import { Navbar, Container, Button } from "react-bootstrap";
import { SummaryModal } from './summaryModal.jsx';
import { ConfirmationModal } from './confirmationModal.jsx';

export function Buttons({ location, setForceRevealAllCards, doneBtnText, setDoneBtnText, numOfQuestions }) {
  const [confModalState, setConfModalState] = useState({ "show": false, "isSolved": false });
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  function handleDoneBtn() {
    if (confModalState.isSolved) {
      setShowSummaryModal(true);
    } else {
      setConfModalState({ ...confModalState, "show": true });
    }
  }

  return (
    <>
      <Navbar className="buttons">
        <Container>
          <Navbar.Brand className="mx-auto">{' '}
            <Button href={getNavBtnLink(location)} variant="secondary">{getNavBtnText(location)}</Button>
            <Button onClick={() => handleDoneBtn()} className="ms-3" variant="success">{doneBtnText}</Button>
            <ConfirmationModal confModalState={confModalState} setConfModalState={setConfModalState} setShowSummaryModal={setShowSummaryModal} />
            <SummaryModal showSummaryModal={showSummaryModal} setShowSummaryModal={setShowSummaryModal}
              setForceRevealAllCards={setForceRevealAllCards}
              setDoneBtnText={setDoneBtnText} numOfQuestions={numOfQuestions} />
          </Navbar.Brand>
        </Container>
      </Navbar>
    </>
  );
}

function getNavBtnText(location) {
  switch (location) {
    case 'beginning':
      return 'תוריד אותי לסוף'
    default:
      return 'תעלה אותי למעלה';
  }
}

function getNavBtnLink(location) {
  switch (location) {
    case 'beginning':
      return '#bottom';
    default:
      return '#top';
  }
}