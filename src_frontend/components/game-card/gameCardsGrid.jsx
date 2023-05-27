import React, { useEffect, useState } from "react";
import { Nav, Navbar, Container, Row, Col, NavDropdown } from "react-bootstrap";
import { GameCard } from './gameCard.jsx';

export function GameCardsGrid({ numOfQuestions, isForceRevealAllCards }) {
    const [previouslySolvedQues, setPreviouslySolvedQues] = useState([]);

    useEffect(() => {
        async function getSolvedQuestions() {
            const resp = await fetch("solved-ques");
            const solvedQuesObj = await resp.json();
            setPreviouslySolvedQues(solvedQuesObj.solved_questions);
        } getSolvedQuestions();
    }, []);

    function getNavDropdownItems() {
        const navDropdownItems = [<NavDropdown.Item
            key="nav-dropdown-item-q1"
            href="#game-card-q1">לקטע #1</NavDropdown.Item>];
        for (let i = 10; i <= numOfQuestions; i += 10) {
            navDropdownItems.push(<NavDropdown.Item
                key={`nav-dropdown-item-q${i}`}
                href={`#game-card-q${i}`}>{`לקטע #${i}`}</NavDropdown.Item>)
        }
        return numOfQuestions > 10 ? navDropdownItems : null
    };

    function isForceReveal(quesNum) {
        if (isForceRevealAllCards) {
            return true;
        } else {
            if (Array.isArray(previouslySolvedQues)) {
                if (!isForceRevealAllCards) {
                    return previouslySolvedQues.includes(quesNum);
                }
            } else { return false; }
        }
    };


    return (
        <>
            <Container data-testid="app-grid" id="game-cards-grid-container">
                <Navbar sticky="top" bg="dark" variant="dark">
                    <Container>
                        <Nav className="mx-auto">
                            <Nav.Link href="#top">חזרה להוראות</Nav.Link>
                            <Nav.Link href="#bottom">סיימתי! תוריד אותי לסוף</Nav.Link>
                            <NavDropdown title="לקפוץ לקטע קול" id="collasible-nav-dropdown">
                                <>{getNavDropdownItems()}</>
                            </NavDropdown>
                        </Nav>
                    </Container>
                </Navbar>
                <Row xs={1} md={3} lg={4} xl={5} className="g-2">
                    {
                        Array.from({ length: numOfQuestions }, (_, i) => `q${i + 1}`).map((quesStr, idx) =>
                            <Col key={`grid-col-${quesStr}`}>
                                <GameCard key={`grid-game-card-component-${quesStr}`}
                                    ques={quesStr}
                                    isForceReveal={isForceReveal(idx + 1)} />
                            </Col>
                        )
                    }
                </Row>
            </Container>
        </>
    );
}