import React from "react";
import { Nav, Navbar, Container, Row, Col, NavDropdown } from "react-bootstrap";
import { GameCard } from './gameCard.jsx';

export function GameCardsGrid({ numOfQuestions, isForceRevealAllCards }) {
    function getNavDropdownItems() {
        const navDropdownItems = [<NavDropdown.Item href="#game-card-q1">קטע #1</NavDropdown.Item>];
        for (let i = 10; i <= numOfQuestions; i += 10) {
            navDropdownItems.push(<NavDropdown.Item href={`#game-card-q${i}`}>{`קטע #${i}`}</NavDropdown.Item>)
        }
        return numOfQuestions > 10 ? navDropdownItems : null
    }

    return (
        <>
            <Container id="game-cards-grid-container">
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
                        Array.from({ length: numOfQuestions }, (_, i) => `q${i + 1}`).map((ques, idx) =>
                            <Col>
                                <GameCard ques={ques} isForceRevealAllCards={isForceRevealAllCards} />
                            </Col>
                        )
                    }
                </Row>
            </Container>
        </>
    );
}