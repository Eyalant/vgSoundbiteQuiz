import React from 'react'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { DoneBtn } from '../../../components/buttons/doneBtn.jsx'
import { SummaryModal } from '../../../components/modals/summaryModal.jsx'
import { ConfirmationModal } from '../../../components/modals/confirmationModal.jsx'

jest.mock('../../../components/modals/confirmationModal.jsx', () => {
    return {
        ConfirmationModal: () => {
            return (<div>confirmation dialog</div>)
        }
    }
});

jest.mock('../../../components/modals/summaryModal.jsx', () => {
    return {
        SummaryModal: () => {
            return (
                <div>סיכום</div>
            )
        }
    }
});

beforeEach(() => {
    render(<DoneBtn />);
})

describe("unit", () => {
    it("renders the 'done' button", async () => {
        await waitFor(async () => expect(screen.getByText("סיימתי", { exact: false })).toBeVisible());
    });

    it("displays a confirmation dialog upon clicking", async () => {
        await act(async () => {
            await userEvent.click((screen.getByTestId("done-btn")));
        });
        await waitFor(async () => expect(screen.getByText("confirmation dialog", { exact: false })).toBeVisible());
    });
});