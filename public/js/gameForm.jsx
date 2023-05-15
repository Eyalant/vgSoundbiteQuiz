function GameForm({ id, updateGameCard, cardState, setCardState }) {
    const waitTimeForMoreInput = 250;
    const checkUserInput = async (route) => {
        if (!cardState.gameName || cardState.isSolved) return;
        const question_number = parseInt(id.split("q")[1]);
        const req = { "force": false, "q_num": question_number, "userans": cardState.gameName };
        await updateGameCard(route, req);
    }

    useEffect(() => {
        const debouncedCheckUserInput = setTimeout(checkUserInput, waitTimeForMoreInput, "/ans");
        return () => clearTimeout(debouncedCheckUserInput);
    }, [cardState.gameName]);

    const handleChange = evt => {
        evt.preventDefault();
        setCardState({...cardState, gameName: evt.target.value});
    }

    return (
        <Form.Control className="mx-auto text-center" id={`game-form-${id}`}
            onChange={evt => handleChange(evt)} placeholder="המשחק הזה הוא..."
            value={cardState.gameName} disabled={cardState.isGameFormDisabled} />
    )
}