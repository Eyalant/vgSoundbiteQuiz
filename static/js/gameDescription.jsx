function GameDescription({ release_info, description }) {
    return (
        <>
            <Card.Text className="fw-bold">{release_info}</Card.Text>
            <Card.Text>{description}</Card.Text>
        </>
    )
}