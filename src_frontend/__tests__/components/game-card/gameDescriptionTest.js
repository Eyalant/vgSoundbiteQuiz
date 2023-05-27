import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { GameDescription } from '../../../components/game-card/gameDescription.jsx';


describe("unit", () => {
    beforeEach(async () => {
        render(<GameDescription releaseInfo="some_info" description="some_description" />);
    });

    it("should load and display the game description", async () => {
        await waitFor(() => {
            expect(screen.getByText("some_info", { exact: false })).toBeVisible();
            expect(screen.getByText("some_description", { exact: false })).toBeVisible();
        });
    })
});