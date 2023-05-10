function GameCard({ ques, isForceRevealAllCards }) {
    const [imgSrc, setImgSrc] = useState("/static/mario_ques_block.webp");
    const [imgStyle, setImgStyle] = useState({});
    const [cardState, setCardState] = useState({
        isSolved: false, gameName: "", description: "", relInfo: "", isGameFormDisabled: false,
        showRevealAnsBtn: "visible"
    });

    const updateGameCard = async (route, req) => {
        const raw_resp = await _fetchRawRespFromServer(route, req);
        let resp;
        switch (route) {
            case "/ans":
                resp = await raw_resp.json();
                if (resp.possible_answers.length) {
                    setCardState({
                        isSolved: true, gameName: resp.possible_answers[0], description: resp.description, relInfo: `(${resp.release_year}, ${resp.release_plat})`,
                        isGameFormDisabled: true, showRevealAnsBtn: "invisible"
                    });
                    await updateGameCard("/ans/img", req);
                }
                break;
            case "/ans/img":
                resp = await raw_resp.blob();
                const imgURL = URL.createObjectURL(resp);
                const flip = new Audio("static/flip.m4a");
                if (isForceRevealAllCards) {
                    setImgSrc(imgURL);
                } else {
                    setTimeout(setImgSrc, 1350, imgURL);
                    setTimeout(() => flip.play(), 500);
                    if (!req.force) {
                        const coin = new Audio("static/coin.m4a");
                        setTimeout(() => coin.play(), 2500);
                    }
                    setImgStyle({ animation: `spin ${3}s` });
                }
                break;
        }
    };

    async function _fetchRawRespFromServer(route, req) {
        const raw_resp = await fetch(route, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(req),
        });
        return raw_resp;
    };

    async function forceRevealCard() {
        setCardState({...cardState, isSolved: true, showRevealAnsBtn: "invisible"});
        const question_number = _getQuesNumFromStr(ques);
        const req = { "force": true, "q_num": question_number, "userans": "" };
        await updateGameCard("/ans", req);
    }

    function _getQuesNumFromStr(ques) {
        return parseInt(ques.split("q")[1]);
    }

    useEffect(() => {
        const revealAllCards = async () => {
            if (isForceRevealAllCards) await forceRevealCard();
        }
        revealAllCards();
    }, [isForceRevealAllCards]);

    return (
        <Card id={`game-card-${ques}`} className="bg-black">
            <Card.Img id={`img-id-${ques}`} style={imgStyle} variant="top" src={imgSrc} />
            <Card.Body>
                <Card.Title>קטע #{_getQuesNumFromStr(ques)}</Card.Title>
                <audio controls src={`/static/questions_audio/${ques}.m4a`}></audio>
                <GameForm id={ques} updateGameCard={updateGameCard} cardState={cardState} setCardState={setCardState} />
                <GameDescription release_info={cardState.relInfo} description={cardState.description} />
                <Button onClick={forceRevealCard} className={`ms-3 ${cardState.showRevealAnsBtn}`} variant="outline-danger">חשוף תשובה</Button>
            </Card.Body>
        </Card>
    )
}