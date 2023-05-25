import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import '@testing-library/jest-dom'
import { App } from '../app.jsx'

beforeEach(async () => {
    await act(async () => {
        global.fetch = jest.fn(() => Promise.resolve(
            {
                json: () => Promise.resolve({ num: 100 })
            }
        ));
    }
    );
});

afterEach(() => {
    global.fetch.mockClear();
    delete global.fetch;
});


describe("unit", () => {
    it("display the main page and it's main elements", async () => {
        render(<App />);
        await waitFor(async () => {
            expect(screen.getByText("בהצלחה", { exact: false })).toBeVisible();
            expect(screen.getByText("תוריד אותי לסוף", { exact: false })).toBeVisible();
            expect(screen.getByText("חזרה להוראות", { exact: false })).toBeVisible();
            expect(screen.getByText("100 קטעי קול", { exact: false })).toBeVisible();
            expect(screen.getByText("לפעמים אני גם פה", { exact: false })).toBeVisible();
            expect(screen.getByTestId("app-grid")).toBeVisible();
        });
    });
});