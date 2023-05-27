import React from 'react'
import { act, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { GameCardsGrid } from '../../../components/game-card/gameCardsGrid.jsx';

beforeEach(async () => {
    await act(async () => {
        global.URL.createObjectURL = jest.fn();
        global.HTMLMediaElement.prototype.play = jest.fn();
        global.fetch = jest.fn(() => Promise.resolve(
            {
                json: () => Promise.resolve({ solved_questions: [2], possible_answers: ["my-game"] }),
                blob: () => Promise.resolve(() => "Data")
            }
        ));
        jest.useFakeTimers({ 'legacyFakeTimers': true });
    }
    );
    render(<GameCardsGrid numOfQuestions={3} isForceRevealAllCards={false} />);
});


afterEach(() => {
    global.fetch.mockClear();
    delete global.fetch;
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
});

describe("integration", () => {
    it("should display the grid and the nav, and solve card #2 as it previously solved", async () => {
        await waitFor(async () => {
            expect(screen.getByText("חזרה להוראות")).toBeVisible();
            expect(screen.getByText("סיימתי", { exact: false })).toBeVisible();
            expect(screen.getByText("לקפוץ לקטע קול", { exact: false })).toBeVisible();
            expect(screen.getByText("קטע #1")).toBeVisible();
            expect(screen.getByText("קטע #3")).toBeVisible();
            expect(screen.queryByText("קטע #4")).not.toBeInTheDocument();
            expect(screen.queryByText("לקטע #1")).not.toBeInTheDocument();
        });
        await act(async () => {
            jest.advanceTimersByTime(300);
        });
        await waitFor(async () => {
            expect(global.HTMLMediaElement.prototype.play).not.toBeCalled();
            expect(screen.getByTestId("game-form-q2")).toHaveValue("my-game");
            expect(screen.getByTestId("game-form-q1")).toHaveValue("");
        })
    });
});