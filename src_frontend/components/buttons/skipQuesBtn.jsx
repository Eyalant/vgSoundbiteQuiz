import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { ConfirmationModal } from '../modals/confirmationModal.jsx';

export function SkipQuesBtn({ onConfirmAfterthought, className }) {
    const [skipQuesConfModalState, setSkipQuesConfModalState] = useState({
        "show": false, "isSolved": false, "returnBtnVariant": "secondary", "text":
            <>
                לדלג על השאלה ולחשוף את התשובה?<br />
                לא יינתן עבורה ניקוד.
            </>, onConfirm: () => {
                setSkipQuesConfModalState({ ...skipQuesConfModalState, "show": false, "isSolved": true });
                onConfirmAfterthought();
            }
    });

    function handleSkipQuesBtn() {
        if (!skipQuesConfModalState.isSolved) {
            setSkipQuesConfModalState({ ...skipQuesConfModalState, "show": true });
        }
    }

    return (
        <>
            <Button id="skip-ques-btn" variant="outline-danger" onClick={() => handleSkipQuesBtn()} className={className}>לדלג ולחשוף תשובה</Button>
            <ConfirmationModal confModalState={skipQuesConfModalState} setConfModalState={setSkipQuesConfModalState} />
        </>
    );
}