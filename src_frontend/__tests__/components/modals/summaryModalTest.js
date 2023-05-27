import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { SummaryModal } from '../../../components/modals/summaryModal.jsx';
import { ScoreIcons } from '../../../components/landing-and-summary/scoreIcons.jsx';

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

jest.mock('../../../components/landing-and-summary/scoreIcons.jsx', () => {
    return {
        ScoreIcons: () => {
            return (<div>little purple space invaders</div>)
        }
    }
});

describe("unit", () => {
    it("should display the summary modal", async () => {
        render(<SummaryModal showSummaryModal={true} />);
        await waitFor(async () => {
            expect(screen.getByText("ווהו", { exact: false })).toBeVisible();
            expect(screen.getByText("הצלחת לזהות 35", { exact: false })).toBeVisible();
            expect(screen.getByText("שתפ/י", { exact: false })).toBeVisible();
            const shareIcons = screen.getAllByRole("share-icon");
            expect(shareIcons).toHaveLength(2);
            screen.getAllByRole("share-icon").forEach(item => {
                expect(item).toBeVisible();
                expect(item).toHaveAttribute("href");
            });
            expect(screen.getByText("little purple space invaders")).toBeVisible();
            expect(screen.getByTestId("revealall-btn")).toBeVisible();
            expect(screen.getByTestId("refresh-page-btn")).toBeVisible();
        });
    });

    it("should not display the summary modal", async () => {
        render(<SummaryModal showSummaryModal={false} />);
        await waitFor(() => expect(screen.queryByText("ווהו", { exact: false })).not.toBeInTheDocument());
    });

    it("should reveal all answers upon choosing to do so", async () => {
        const mockSetShowSummaryModal = jest.fn();
        const mockSetForceRevealAllCards = jest.fn();
        const mockSetDoneBtnText = jest.fn();
        const mockSetLandingMessage = jest.fn();
        render(<SummaryModal showSummaryModal={true}
            setShowSummaryModal={mockSetShowSummaryModal}
            setForceRevealAllCards={mockSetForceRevealAllCards}
            setDoneBtnText={mockSetDoneBtnText}
            setLandingMessage={mockSetLandingMessage}
            numOfQuestions={100} />);
        await waitFor(async () => {
            expect(screen.getByTestId("revealall-btn")).toHaveTextContent("לחזור ולחשוף תשובות");
        })
        await act(async () => await userEvent.click((screen.getByTestId("revealall-btn"))));
        await waitFor(async () => {
            expect(mockSetShowSummaryModal).toBeCalledWith(false);
            expect(mockSetForceRevealAllCards).toBeCalledWith(true);
            expect(mockSetDoneBtnText).toBeCalledWith("חזרה לסיכום");
            expect(screen.getByTestId("revealall-btn")).toHaveTextContent("חזור");
        });
    });

    it("should refresh the page upon choosing to do so", async () => {
        const reload = jest.fn();
        jest.spyOn(window, "location", "get").mockImplementation(() => ({ reload }));
        render(<SummaryModal showSummaryModal={true} />);
        await act(async () => {
            await userEvent.click((screen.getByTestId("refresh-page-btn")));
        });
        await waitFor(() => expect(reload).toHaveBeenCalled());
    });
});