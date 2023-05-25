import React from "react";
import { Container, Modal, Button } from "react-bootstrap";

export function ConfirmationModal({ confModalState, setConfModalState }) {
    const handleClose = () => setConfModalState({ ...confModalState, "show": false });
    return (
        <Modal
            id="confirmation-modal" centered
            show={confModalState.show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header className="mx-auto">
                <p className="fw-bold text-center">
                    {confModalState.text}
                </p>
            </Modal.Header>
            <Modal.Body>
                <Container className="text-center">
                    <Button data-testid="do-not-confirm-btn" className="ms-3" variant={confModalState.returnBtnVariant} onClick={() => handleClose()}>בוא נחזור</Button>
                    <Button data-testid="confirm-btn" className="ms-3" variant="danger" onClick={confModalState.onConfirm}>כן, יאללה!</Button>
                </Container>
            </Modal.Body>
        </Modal>
    );
}