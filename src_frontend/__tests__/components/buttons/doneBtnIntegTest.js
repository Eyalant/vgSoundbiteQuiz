import React from 'react'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { DoneBtn } from '../../../components/buttons/doneBtn.jsx'

beforeEach(async () => {
    await act(async () => {
        global.fetch = jest.fn(() => Promise.resolve(
            {
                json: () => Promise.resolve({ score: 35 })
            }
        ));
    }
    );
});

afterEach(() => {
    global.fetch.mockClear();
    delete global.fetch;
});

beforeEach(() => {
    render(<DoneBtn />);
});


describe("integration", () => {
    it("should display the summary modal after clicking and confirming", async () => {
        await act(async () => {
            await userEvent.click((screen.getByTestId("done-btn")));
        });
        await act(async () => {
            await userEvent.click((screen.getByTestId("confirm-btn")));
        });
        await waitFor(async () => {
            expect(screen.getByText("ווהו", { exact: false })).toBeVisible();
            expect(screen.getByText("35", { exact: false })).toBeVisible();
        });
    });

    it("should not display the summary modal after clicking yet returning", async () => {
        await act(async () => {
            await userEvent.click((screen.getByTestId("done-btn")));
        });
        await act(async () => {
            await userEvent.click((screen.getByTestId("do-not-confirm-btn")));
        });
        await waitFor(async () => {
            expect(screen.queryByText("ווהו", { exact: false })).not.toBeInTheDocument();
            expect(screen.queryByText("35", { exact: false })).not.toBeInTheDocument();
        });
    });
});