import React from "react";
import { Card } from "react-bootstrap";

export function LandingMessage({ message }) {
    return (
        <Card id="landing-msg-card" className="text-white text-center">
            <br />
            <Card.Img data-testid="logo" id="logo" className="mx-auto" src="/public/assets/logo.png" />
            <Card.Body>
                <Card.Text className="lead text-white">
                    {message}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}