import React from "react";
import { Container, Modal, Button } from "react-bootstrap";

export function ConfirmationModal({ confModalState, setConfModalState, setShowSummaryModal }) {
    const handleClose = () => setConfModalState({ ...confModalState, "show": false });
    return (
        <Modal
            id="confirmation-modal" size="lg" centered
            show={confModalState.show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <p className="fw-bold text-center">
                    לסכום את הניקוד ולסיים את המשחק?<br />
                    אין אפשרות לענות על שאלות לאחר מכן!
                </p>
            </Modal.Header>
            <Modal.Body>
                <Container className="text-center">
                    <Button className="ms-3" variant="info" onClick={() => handleClose()}>בוא נחזור</Button>
                    <Button className="ms-3" variant="danger" onClick={() => { setConfModalState({ "show": false, "isSolved": true }); setShowSummaryModal(true); }}>כן, יאללה!</Button>
                </Container>
            </Modal.Body>
        </Modal>
    );
}