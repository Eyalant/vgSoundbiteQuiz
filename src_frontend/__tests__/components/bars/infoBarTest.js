import React from 'react'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { InfoBar } from '../../../components/bars/infoBar.jsx'

describe("InfoBar", () => {
    beforeEach(async () => {
        const writeText = jest.fn()
        Object.assign(navigator, {
            clipboard: {
                writeText,
            },
        });
        navigator.clipboard.writeText.mockResolvedValue(undefined);
    });

    it("should load and display InfoBar", async () => {
        render(<InfoBar />);
        await waitFor(() => {
            expect(screen.getByRole("info-bar-container")).toBeInTheDocument();
            expect(screen.getByRole("info-bar-container")).toHaveTextContent("אני גם פה");
            expect(screen.getByTestId("ns-icon")).toBeVisible();
            let links = screen.getAllByRole("link");
            expect(links[0]).toHaveAttribute("href", "https://bhaal.substack.com/");
        });
    });

    it("should copy the Nintendo friend code", async () => {
        render(<InfoBar />);
        await act(async () => {
            await userEvent.click(screen.getByTestId("ns-icon"));
        });
        await waitFor(() => {
            expect(screen.getByTestId("ns-popover")).toBeVisible();
            expect(screen.getByTestId("ns-popover")).toHaveTextContent("העתקתי");
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith("SW-1057-6541-5331");
        });
    });
});