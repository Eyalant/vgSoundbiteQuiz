import React from 'react'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { GameCardsGrid } from '../../../components/game-card/gameCardsGrid.jsx';
import { GameCard } from '../../../components/game-card/gameCard.jsx';

jest.mock('../../../components/game-card/gameCard.jsx', () => {
    return {
        GameCard: () => {
            return (<>
                <p>a-game-card</p>
            </>)
        }
    }
});

beforeEach(async () => {
    await act(async () => {
        global.fetch = jest.fn(() => Promise.resolve(
            {
                json: () => Promise.resolve({ solved_questions: [] })
            }
        ));
    }
    );
    render(<GameCardsGrid numOfQuestions={11} isForceRevealAllCards={false} />);
});


afterEach(() => {
    global.fetch.mockClear();
    delete global.fetch;
});

describe("unit", () => {
    it("should display the grid and the nav", async () => {
        await waitFor(async () => {
            const cards = screen.getAllByText("a-game-card", { exact: false });
            expect(cards).toHaveLength(11);
            cards.forEach(card => {
                async () => {
                    await waitFor(() => {
                        expect(card).toBeVisible();
                    })
                }
            });
        });
    })

    it("should display a list of soundbite shortcuts in the nav upon clicking", async () => {
        await act(async () => {
            await userEvent.click(screen.getByText("לקפוץ לקטע קול", { exact: false }));
        });
        await waitFor(async () => {
            expect(screen.getByText("לקטע #10")).toBeVisible();
            expect(screen.queryByText("לקטע #12")).not.toBeInTheDocument();
        });
    })
});