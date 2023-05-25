import React from 'react'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { SkipQuesBtn } from '../../../components/buttons/skipQuesBtn.jsx'

describe("unit", () => {
    it("should display the skip question button", async () => {
        render(<SkipQuesBtn className={"foo"} />);
        await waitFor(async () => {
            expect(screen.getByText("לדלג", { exact: false })).toBeVisible();
            expect(screen.getByText("לדלג", { exact: false })).toHaveClass("foo");
        })
    });

    it("should show the confirmation modal upon clicking", async () => {
        render(<SkipQuesBtn class="foo" />);
        await act(async () => {
            await userEvent.click(screen.getByText("לדלג ולחשוף", { exact: false }));
        });
        await waitFor(async () => {
            expect(screen.getByText("לא יינתן עבורה ניקוד", { exact: false })).toBeVisible();
        });
    });
});