import React from 'react'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { GameCardsGrid } from '../../../components/game-card/gameCardsGrid.jsx';


describe("unit", () => {
    beforeEach(async () => {
        render(<GameCardsGrid numOfQuestions={100} isForceRevealAllCards={false} />);
    });

    it("should display the grid and the nav", async () => {
        await waitFor(async () => {
            expect(screen.getByText("חזרה להוראות")).toBeVisible();
            expect(screen.getByText("סיימתי", { exact: false })).toBeVisible();
            expect(screen.getByText("לקפוץ לקטע קול", { exact: false })).toBeVisible();
            expect(screen.getByText("קטע #1")).toBeVisible();
            expect(screen.getByText("קטע #100")).toBeVisible();
            expect(screen.queryByText("קטע #101")).not.toBeInTheDocument;
            expect(screen.queryByText("לקטע #80")).not.toBeInTheDocument;
        });
    })

    it("should display a list of soundbite shortcuts in the nav upon clicking", async () => {
        await act(async () => {
            await userEvent.click(screen.getByText("לקפוץ לקטע קול", { exact: false }));
        })
        await waitFor(async () => {
            expect(screen.getByText("לקטע #80")).toBeVisible();
            expect(screen.queryByText("לקטע #81")).not.toBeInTheDocument;
        });
    })
});