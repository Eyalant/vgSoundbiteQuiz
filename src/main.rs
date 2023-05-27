mod ans_handler;
mod cookie_gen;
mod io;
#[cfg(test)]
mod tests;
extern crate dotenv;
#[macro_use]
extern crate rocket;
use dotenv::dotenv;
use rocket::fs::FileServer;
use rocket::http::{Cookie, CookieJar, Status};
use rocket::response::Redirect;
use rocket::serde::{json::Json, Serialize};
use rocket::State;
use rocket_db_pools::Database;
use rocket_dyn_templates::Template;
use serde::Deserialize;
use std::collections::BTreeMap;

#[derive(Deserialize, Serialize, Debug)]
struct NumOfQuestions {
    num: i32,
}

#[derive(Deserialize, Serialize, Debug)]
struct ScoreResp {
    score: i32,
}

#[derive(Deserialize, Serialize, Debug)]
struct SolvedQuestionsResp {
    solved_questions: Vec<i32>,
}

#[launch]
fn rocket() -> _ {
    dotenv().ok();
    // io::store_answers_in_redis().expect("Could not store answers in Redis.");
    let num = io::get_num_of_questions_from_redis();
    if num <= 0 {
        eprintln!("There were no questions to load from redis.");
        std::process::exit(1);
    }
    rocket::build()
        .manage(num)
        .attach(io::RedisPool::init())
        .mount("/", routes![index, get_favicon])
        .attach(Template::fairing())
        .mount("/public", FileServer::from("public/"))
        .mount("/templates", FileServer::from("templates/"))
        .mount("/num-ques", routes![num_questions])
        .mount(
            "/ans",
            routes![ans_handler::answer, ans_handler::answer_img],
        )
        .mount("/score", routes![score])
        .mount("/solved-ques", routes![solved_questions])
        .mount("/clear", routes![clear])
}

#[get("/")]
/// The main quiz page
async fn index(cookies: &CookieJar<'_>) -> Template {
    if cookies.get_private("previously-solved-questions").is_none()
        || cookies.get_private("score").is_none()
    {
        cookie_gen::add_new_initialized_score_cookie(cookies);
        cookie_gen::add_new_initialized_solved_questions_cookie(cookies);
    }
    let mut context: BTreeMap<&str, Vec<String>> = BTreeMap::new(); // in case I'd need it
    Template::render("index", &context)
}

#[get("/")]
/// Returns the number of questions in the quiz
async fn num_questions(num: &State<i32>) -> Json<NumOfQuestions> {
    Json(NumOfQuestions { num: **num })
}

#[get("/")]
/// Returns the user's current score (from a cookie)
async fn score(cookies: &CookieJar<'_>) -> Json<ScoreResp> {
    match cookies.get_private("score") {
        Some(cookie) => {
            let score: i32 = cookie.value().parse().unwrap();
            Json(ScoreResp { score })
        }
        None => Json(ScoreResp { score: 0 }),
    }
}

#[get("/")]
/// Returns the user's previously solved questions (from a cookie)
async fn solved_questions(cookies: &CookieJar<'_>) -> Json<SolvedQuestionsResp> {
    match cookies.get_private("previously-solved-questions") {
        Some(cookie) => {
            let solved_questions = cookie.value().to_string();
            let resp: Vec<i32> = serde_json::from_str(&solved_questions).unwrap();
            Json(SolvedQuestionsResp {
                solved_questions: resp,
            })
        }
        None => Json(SolvedQuestionsResp {
            solved_questions: Vec::<i32>::new(),
        }),
    }
}

#[get("/")]
/// Clears the user's cookies
async fn clear(cookies: &CookieJar<'_>) -> Status {
    cookies.remove_private(Cookie::named("score"));
    cookies.remove_private(Cookie::named("previously-solved-questions"));
    return Status::Ok;
}

#[get("/favicon.ico")]
/// A favicon redirect
async fn get_favicon() -> Redirect {
    Redirect::to(uri!("/public/assets/favicon.ico"))
}
