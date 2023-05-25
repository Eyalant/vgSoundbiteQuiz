import React from 'react'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { ConfirmationModal } from '../../../components/modals/confirmationModal.jsx'

describe("unit", () => {
    it("should display the confirmation modal", async () => {
        const mockConfModalState = { text: "האם אתה בטוח", "show": true, returnBtnVariant: "primary", onConfirm: () => { } };
        render(<ConfirmationModal confModalState={mockConfModalState} />);
        await waitFor(async () => {
            expect(screen.getByText("האם אתה בטוח")).toBeVisible();
            expect(screen.getByTestId("do-not-confirm-btn")).toBeVisible();
            expect(screen.getByTestId("confirm-btn")).toBeVisible();
        })
    });

    it("should close when choosing not to confirm", async () => {
        const mockConfModalState = { text: "האם אתה בטוח", "show": true, returnBtnVariant: "primary", onConfirm: () => { } };
        const mockSetConfModalState = jest.fn();
        render(<ConfirmationModal confModalState={mockConfModalState} setConfModalState={mockSetConfModalState} />);
        await act(async () => {
            await userEvent.click(screen.getByTestId("do-not-confirm-btn"));
        })
        await waitFor(async () => {
            expect(mockSetConfModalState).toBeCalled;
        })
    });

    it("should trigger action when choosing to confirm", async () => {
        const mockOnConfirm = jest.fn();
        const mockConfModalState = { text: "האם אתה בטוח", "show": true, returnBtnVariant: "primary", onConfirm: mockOnConfirm };
        render(<ConfirmationModal confModalState={mockConfModalState} />);
        await act(async () => {
            await userEvent.click(screen.getByTestId("confirm-btn"));
        })
        await waitFor(async () => {
            expect(mockOnConfirm).toBeCalled;
        })
    });
});