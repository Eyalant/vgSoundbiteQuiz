import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ScoreIcons } from '../../../components/landing-and-summary/scoreIcons.jsx'

describe("unit", () => {
    it("should display no golden icons", async () => {
        render(<ScoreIcons score={0} numOfQuestions={100} />);
        await waitFor(() => {
            expect(screen.queryByRole("score-icon-golden")).not.toBeInTheDocument();
            expect(screen.getAllByRole("score-icon-grey")).toHaveLength(5);
        });
    });

    it("should display 1/5 golden icons", async () => {
        render(<ScoreIcons score={1} numOfQuestions={100} />);
        await waitFor(() => {
            expect(screen.getAllByRole("score-icon-golden")).toHaveLength(1);
            expect(screen.getAllByRole("score-icon-grey")).toHaveLength(4);
        });
    });

    it("should display 3/5 golden icons", async () => {
        render(<ScoreIcons score={40} numOfQuestions={100} />);
        await waitFor(() => {
            expect(screen.getAllByRole("score-icon-golden")).toHaveLength(3);
            expect(screen.getAllByRole("score-icon-grey")).toHaveLength(2);
        });
    });

    it("should display all golden icons", async () => {
        render(<ScoreIcons score={100} numOfQuestions={100} />);
        await waitFor(() => {
            expect(screen.getAllByRole("score-icon-golden")).toHaveLength(5);
            expect(screen.queryByRole("score-icon-grey")).not.toBeInTheDocument();
        });
    });
});