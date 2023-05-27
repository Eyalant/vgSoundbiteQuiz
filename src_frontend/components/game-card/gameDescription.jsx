import React from "react";
import { Card } from "react-bootstrap";

export function GameDescription({ releaseInfo, description }) {
    return (
        <>
            <Card.Text className="fw-bold">{releaseInfo}</Card.Text>
            <Card.Text>{description}</Card.Text>
        </>
    )
}