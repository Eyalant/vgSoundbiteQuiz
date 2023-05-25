import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { PageNavBtn } from '../../../components/buttons/pageNavBtn.jsx';

describe("unit", () => {
    it("should display the beginning page navigation button", async () => {
        render(<PageNavBtn location={"beginning"} asIcon={false} />);
        await waitFor(async () => {
            const btn = screen.getByText("תוריד אותי לסוף", { exact: false });
            expect(btn).toBeVisible();
            expect(btn).toHaveAttribute("href", "#bottom");
        })
    });

    it("should display the end page navigation button", async () => {
        render(<PageNavBtn asIcon={false} />);
        await waitFor(async () => {
            const btn = screen.getByText("בחזרה למעלה", { exact: false });
            expect(btn).toBeVisible();
            expect(btn).toHaveAttribute("href", "#top");
        });
    });

    it("should display the page navigation button as an icon", async () => {
        render(<PageNavBtn location="beginning" asIcon={true} />);
        await waitFor(async () => {
            const icon = screen.getByTestId("pagenav-icon-beginning");
            expect(icon).toBeVisible();
            expect(icon.parentElement).toHaveAttribute("href", "#bottom");
        });
    });
});