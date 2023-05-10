use crate::io::{RedisPool, Answer};
use deadpool_redis::redis::AsyncCommands;
use rocket::fs::NamedFile;
use rocket::http::{Cookie, CookieJar};
use rocket::serde::{json::Json, Deserialize};
use rocket_db_pools::{deadpool_redis, Connection};
use serde_json;
use std::path::Path;

#[derive(Deserialize, Debug)]
pub struct UserInput {
    force: bool,
    q_num: i32,
    userans: String,
}

#[post("/", format = "json", data = "<req>")]
/// Returns a question's answer to the client.
pub async fn answer(
    mut db: Connection<RedisPool>,
    req: Json<UserInput>,
    cookies: &CookieJar<'_>,
) -> Json<Answer> {
    let ans = _get_ans_from_req(db, &req).await;
    if req.force {
        // user forced an answer reveal
        Json(ans)
    } else if _is_userans_correct(ans.possible_answers.clone(), req.userans.clone()) {
        // user was right
        let mut current_score: i32 = cookies
            .get_private("score")
            .unwrap()
            .value()
            .parse()
            .unwrap();
        current_score += 1;
        cookies.add_private(Cookie::new("score", current_score.to_string()));
        Json(ans)
    } else {
        // user typed in an incorrect answer
        Json(Answer::new())
    }
}

#[post("/img", format = "json", data = "<req>")]
/// Returns the image attached to an the given request's answer.
pub async fn answer_img(
    mut db: Connection<RedisPool>,
    req: Json<UserInput>,
) -> Option<NamedFile> {
    let ans = _get_ans_from_req(db, &req).await;
    if req.force || _is_userans_correct(ans.possible_answers.clone(), req.userans.clone()) {
        let file = format!("a{}.jpg", req.q_num);
        NamedFile::open(Path::new("ans_images/").join(file))
            .await
            .ok()
    } else {
        None
    }
}

/// Given a request with a question number, return the associated Answer.
async fn _get_ans_from_req(mut db: Connection<RedisPool>, req: &Json<UserInput>) -> Answer {
    let user_q_num = format!("q{}", req.q_num);
    let ans_json_string: String = db.get(&user_q_num).await.unwrap_or(String::from(""));
    serde_json::from_str(&ans_json_string).unwrap_or(Answer::new())
}

/// Checks if the user's input is one of the possible answers.
fn _is_userans_correct(possible_answers: Vec<String>, received_user_ans: String) -> bool {
    let lowercase_possible_answers: Vec<String> = possible_answers
        .into_iter()
        .map(|s| s.to_lowercase())
        .collect();
    lowercase_possible_answers.contains(&received_user_ans.to_lowercase())
}
