import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { GameDescription } from './gameDescription.jsx';
import { GameForm } from './gameForm.jsx';
import { SkipQuesBtn } from "../buttons/skipQuesBtn.jsx";

export function GameCard({ ques, isForceReveal }) {
    const [imgSrc, setImgSrc] = useState("/public/assets/mario_ques_block.webp");
    const [imgStyle, setImgStyle] = useState({});
    const [cardState, setCardState] = useState({
        isSolved: false, gameName: "", description: "", relInfo: "", isGameFormDisabled: false,
        showSkipQuesBtn: "visible"
    });


    const updateGameCard = async (route, req) => {
        const raw_resp = await _fetchRawRespFromServer(route, req);
        let resp;
        switch (route) {
            case "/ans":
                resp = await raw_resp.json();
                if (resp.possible_answers === undefined) {
                    return;
                }
                if (resp.possible_answers.length) {
                    setCardState({
                        isSolved: true,
                        gameName: resp.possible_answers[0],
                        description: resp.description,
                        relInfo: `(${resp.release_year}, ${resp.release_plat})`,
                        isGameFormDisabled: true, showSkipQuesBtn: "invisible"
                    });
                    await updateGameCard("/ans/img", req);
                }
                break;
            case "/ans/img":
                resp = await raw_resp.blob();
                const imgURL = URL.createObjectURL(resp);
                const flip = new Audio("public/assets/flip.m4a");
                if (isForceReveal) {
                    setImgSrc(imgURL);
                } else {
                    setTimeout(setImgSrc, 1350, imgURL);
                    setTimeout(() => flip.play(), 500);
                    if (!req.force) {
                        const coin = new Audio("public/assets/coin.m4a");
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

    async function doForceRevealCard() {
        setCardState({ ...cardState, isSolved: true, showSkipQuesBtn: "invisible" });
        const question_number = _getQuesNumFromStr(ques);
        const req = { "force": true, "q_num": question_number, "userans": "" };
        await updateGameCard("/ans", req);
    }

    function _getQuesNumFromStr(ques) {
        return parseInt(ques.split("q")[1]);
    }

    useEffect(() => {
        const forceReveal = async () => {
            if (isForceReveal) await doForceRevealCard();
        }
        forceReveal();
    }, [isForceReveal]);

    return (
        <Card data-testid={`game-card-${ques}`} id={`game-card-${ques}`} className="mx-auto bg-grey">
            <Card.Img data-testid={`img-id-${ques}`} id={`img-id-${ques}`} style={imgStyle} variant="top" src={imgSrc} />
            <Card.Body>
                <Card.Title>קטע #{_getQuesNumFromStr(ques)}</Card.Title>
                <audio controls
                    preload="none"
                    controlsList="nodownload noplaybackrate"
                    src={`/public/questions_audio/${ques}.mp3`}></audio>
                <GameForm id={ques} updateGameCard={updateGameCard} cardState={cardState} setCardState={setCardState} />
                <GameDescription releaseInfo={cardState.relInfo} description={cardState.description} />
                <SkipQuesBtn onConfirm={doForceRevealCard} className={`mx-auto ${cardState.showSkipQuesBtn}`} />
            </Card.Body>
        </Card>
    )
}