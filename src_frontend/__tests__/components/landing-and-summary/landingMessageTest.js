import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { LandingMessage } from '../../../components/landing-and-summary/landingMessage.jsx';


describe("LandingMessage", () => {
    beforeEach(async () => {
        render(<LandingMessage />);
    });

    it("should load and display the landing message", async () => {
        await waitFor(async () => {
            expect(screen.getByTestId("logo")).toBeVisible();
            expect(screen.getByText("ברוכות הבאות", { exact: false })).toBeVisible();
            expect(screen.getByText("בהצלחה", { exact: false })).toBeVisible();
        });
    })
});