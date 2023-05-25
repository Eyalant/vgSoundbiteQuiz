import React from 'react'
import { render, screen, act, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { GameForm } from '../../../components/game-card/gameForm.jsx';

const mockCardState = {
    isSolved: false,
    gameName: "my-game",
    description: "my-descript",
    relInfo: "my-rel-info",
    isGameFormDisabled: false,
    showSkipQuesBtn: true
}
const mockUpdateGameCard = jest.fn();
const mockSetCardState = jest.fn();

beforeEach(() => {
    jest.useFakeTimers({ 'legacyFakeTimers': true });
    render(<GameForm id="3" updateGameCard={mockUpdateGameCard} cardState={mockCardState} setCardState={mockSetCardState} />);
});

afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
})

describe("unit", () => {
    it("should display the game form", async () => {
        const form = screen.getByPlaceholderText("המשחק הזה הוא", { exact: false });
        await waitFor(async () => {
            expect(form).toHaveAttribute("id", "game-form-3");
            expect(form).toBeVisible();
            expect(form).toHaveValue("my-game");
        })
    })

    it("should change when typing an answer", async () => {
        const user = userEvent.setup({delay: null});
        await waitFor(async () => {
            expect(mockUpdateGameCard).not.toBeCalled();
            expect(mockSetCardState).not.toBeCalled();
        });
        await act(async () => {
            await user.type(screen.getByPlaceholderText("המשחק הזה הוא", { exact: false }), "something");
        });
        await act(async () => {
            jest.advanceTimersByTime(300);
        });
        await waitFor(async () => {
            expect(mockSetCardState).toBeCalled();
            expect(mockUpdateGameCard).toBeCalled();
        });
    })
});