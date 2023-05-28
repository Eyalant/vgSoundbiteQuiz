#[cfg(test)]
mod tests;

use crate::cookie_helper;
use crate::io::{Answer, RedisPool};
use deadpool_redis::redis::AsyncCommands;
use rocket::fs::NamedFile;
use rocket::http::{Cookie, CookieJar};
use rocket::serde::{json::Json, Deserialize};
use rocket::time::Duration;
use rocket_db_pools::{deadpool_redis, Connection};
use serde::Serialize;
use serde_json;
use std::path::Path;

#[derive(Serialize, Deserialize, Debug)]
pub struct UserInput {
    force: bool,
    q_num: i32,
    userans: String,
}

#[cfg(not(test))]
use get_ans_from_req as get_ans_from_req_fn;
#[cfg(test)]
use tests::test::mocked_get_ans_from_req as get_ans_from_req_fn;
#[post("/", format = "json", data = "<req>")]
/// Returns a question's answer to the client
pub async fn answer(
    mut db: Connection<RedisPool>,
    req: Json<UserInput>,
    cookies: &CookieJar<'_>,
) -> Json<Answer> {
    let ans = get_ans_from_req_fn(db, &req).await;
    if req.force {
        // user forced an answer reveal
        _update_user_cookies(cookies, req.q_num, false);
        Json(ans)
    } else if _is_userans_correct(ans.possible_answers.clone(), req.userans.clone()) {
        _update_user_cookies(cookies, req.q_num, true);
        Json(ans)
    } else {
        // user typed in an incorrect answer
        Json(Answer::new())
    }
}

/// Saves the solved question # and increments user score, if requested
fn _update_user_cookies(cookies: &CookieJar<'_>, question: i32, increase_score: bool) {
    match cookies.get_private("previously-solved-questions") {
        Some(cookie) => {
            let solved_questions_str = cookie.value().to_string();
            let mut solved_questions: Vec<i32> =
                serde_json::from_str(&solved_questions_str).expect("Could not deserialize solved questions vector");
            if solved_questions.contains(&question) {
                return; // question was already solved
            }
            solved_questions.push(question);
            cookie_helper::add_new_custom_cookie(
                cookies,
                "previously-solved-questions".to_string(),
                serde_json::to_string(&solved_questions).expect("Could not stringify solved questions vector"),
            );
        }
        None => {
            // shouldn't be empty, so get new ones
            cookie_helper::add_new_initialized_cookie(cookies, "score".to_string());
            cookie_helper::add_new_initialized_cookie(
                cookies,
                "previously-solved-questions".to_string(),
            );
            return;
        }
    };

    if increase_score {
        match cookies.get_private("score") {
            Some(cookie) => {
                let mut current_score: i32 = cookie.value().parse().expect("Could not parse score cookie value");
                current_score += 1;
                cookie_helper::add_new_custom_cookie(
                    cookies,
                    "score".to_string(),
                    current_score.to_string(),
                );
            }
            None => {
                // shouldn't be empty, so get new ones
                cookie_helper::add_new_initialized_cookie(cookies, "score".to_string());
                cookie_helper::add_new_initialized_cookie(
                    cookies,
                    "previously-solved-questions".to_string(),
                );
                return;
            }
        };
    };
}

#[cfg(not(test))]
use get_ans_from_req as get_ans_from_req_fn_ans_img;
#[cfg(test)]
use tests::test::mocked_get_ans_from_req as get_ans_from_req_fn_ans_img;
#[post("/img", format = "json", data = "<req>")]
/// Returns the image attached to an the given request's answer
pub async fn answer_img(mut db: Connection<RedisPool>, req: Json<UserInput>) -> Option<NamedFile> {
    let ans = get_ans_from_req_fn_ans_img(db, &req).await;
    if req.force || _is_userans_correct(ans.possible_answers.clone(), req.userans.clone()) {
        let file = format!("a{}.jpg", req.q_num);
        NamedFile::open(Path::new("ans_images/").join(file))
            .await
            .ok()
    } else {
        None
    }
}

/// Checks if the user's input is one of the possible answers
fn _is_userans_correct(possible_answers: Vec<String>, received_user_ans: String) -> bool {
    let lowercase_possible_answers: Vec<String> = possible_answers
        .into_iter()
        .map(|s| s.to_lowercase())
        .collect();
    lowercase_possible_answers.contains(&received_user_ans.to_lowercase())
}

/// Given a request with a question number, returns the associated Answer
async fn get_ans_from_req(mut db: Connection<RedisPool>, req: &Json<UserInput>) -> Answer {
    let user_q_num = format!("q{}", req.q_num);
    let ans_json_string: String = db.get(&user_q_num).await.unwrap_or(String::from(""));
    serde_json::from_str(&ans_json_string).unwrap_or(Answer::new())
}
