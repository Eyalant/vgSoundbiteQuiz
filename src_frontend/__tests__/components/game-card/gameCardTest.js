import React from 'react'
import { render, screen, act, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { GameCard } from '../../../components/game-card/gameCard.jsx';

beforeEach(async () => {
    await act(async () => {
        global.URL.createObjectURL = jest.fn();
        global.HTMLMediaElement.prototype.play = jest.fn();
        global.fetch = jest.fn(() => Promise.resolve(
            {
                json: () => Promise.resolve({ possible_answers: ["my-game"] }),
                blob: () => Promise.resolve(() => "Data")
            }
        ));
    }
    );
    jest.useFakeTimers({ 'legacyFakeTimers': true });
});

afterEach(() => {
    global.fetch.mockClear();
    delete global.fetch;
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
});

describe("unit", () => {
    it("should display the game card", async () => {
        render(<GameCard ques="q3" isForceRevealAllCards={false} />);
        const card = screen.getByTestId("game-card-q3");
        await waitFor(async () => {
            expect(card).toHaveAttribute("id", "game-card-q3");
            expect(card).toBeVisible();
            expect(card).toHaveTextContent("קטע #3");
            expect(card).toContainHTML("<img");
            expect(card).toContainHTML("<audio");
            expect(card).toHaveTextContent("לדלג ולחשוף");
        });
    })
});

describe("integration", () => {
    it("should update the card when typing a correct answer in the form", async () => {
        render(<GameCard ques="q3" isForceRevealAllCards={false} />);
        const skipQuesBtn = screen.getByText("לדלג ולחשוף", { exact: false });
        const form = screen.getByPlaceholderText("המשחק הזה הוא", { exact: false });
        const user = userEvent.setup({ delay: null });
        await waitFor(async () => {
            expect(form).toHaveValue("");
            expect(global.HTMLMediaElement.prototype.play).not.toBeCalled();
            expect(screen.getByTestId("img-id-q3")).not.toHaveAttribute("style");
            expect(skipQuesBtn).toHaveClass("visible");
        })
        await act(async () => {
            await user.type(form, "something");

        });
        await act(async () => {
            jest.advanceTimersByTime(300);
        });
        await waitFor(async () => {
            expect(form).toHaveValue("my-game");
            expect(global.HTMLMediaElement.prototype.play).toBeCalled();
            expect(screen.getByTestId("img-id-q3")).toHaveStyle("animation: spin 3s;");
            expect(skipQuesBtn).toHaveClass("invisible");
        })
    })

    it("should update the card without animating when isForceRevealAllCards is true", async () => {
        render(<GameCard ques="q3" isForceRevealAllCards={true} />);
        const form = screen.getByPlaceholderText("המשחק הזה הוא", { exact: false });
        await waitFor(async () => {
            expect(form).toHaveValue("my-game");
            expect(screen.getByTestId("img-id-q3")).not.toHaveAttribute("style");
        })
    })

    it("should update the card when the skip question button is clicked and confirmed", async () => {
        render(<GameCard ques="q3" isForceRevealAllCards={false} />);
        const form = screen.getByPlaceholderText("המשחק הזה הוא", { exact: false });
        const user = userEvent.setup({ delay: null });
        const skipQuesBtn = screen.getByText("לדלג ולחשוף", { exact: false });
        await act(async () => {
            await user.click(skipQuesBtn);
        });
        await act(async () => {
            const confirmBtn = screen.getByText("יאללה", { exact: false });
            await user.click(confirmBtn);
        });
        await waitFor(async () => {
            expect(form).toHaveValue("my-game");
            expect(global.HTMLMediaElement.prototype.play).toBeCalled();
            expect(screen.getByTestId("img-id-q3")).toHaveStyle("animation: spin 3s;");
            expect(skipQuesBtn).toHaveClass("invisible");
        })
    })

    it("should not update the card when the skip question button is clicked yet not confirmed", async () => {
        render(<GameCard ques="q3" isForceRevealAllCards={false} />);
        const form = screen.getByPlaceholderText("המשחק הזה הוא", { exact: false });
        const user = userEvent.setup({ delay: null });
        const skipQuesBtn = screen.getByText("לדלג ולחשוף", { exact: false });
        await act(async () => {
            await user.click(skipQuesBtn);
        });
        await act(async () => {
            const doNotConfirmBtn = screen.getByText("בוא נחזור", { exact: false });
            await user.click(doNotConfirmBtn);
        });
        await waitFor(async () => {
            expect(form).not.toHaveValue("my-game");
            expect(global.HTMLMediaElement.prototype.play).not.toBeCalled();
            expect(screen.getByTestId("img-id-q3")).not.toHaveAttribute("style");
            expect(skipQuesBtn).toHaveClass("visible");
        })
    })
});