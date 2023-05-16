mod ans_handler;
mod io;
extern crate dotenv;
#[macro_use]
extern crate rocket;
use rocket::fs::FileServer;
use rocket::http::{Cookie, CookieJar};
use rocket::response::Redirect;
use rocket::serde::{json::Json, Serialize};
use rocket::State;
use rocket_db_pools::Database;
use rocket_dyn_templates::Template;
use std::collections::BTreeMap;
use dotenv::dotenv;

#[derive(Serialize, Debug)]
struct NumOfQuestions {
    num: i32,
}

#[derive(Serialize, Debug)]
struct ScoreResp {
    score: i32,
}

#[launch]
fn rocket() -> _ {
    dotenv().ok();
    io::store_answers_in_redis().expect("Could not store answers in Redis.");
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
}

#[get("/")]
/// The main quiz page
async fn index(cookies: &CookieJar<'_>) -> Template {
    cookies.add_private(Cookie::new("score", 0.to_string()));
    let mut context: BTreeMap<&str, Vec<String>> = BTreeMap::new(); // in case I'd need it
    Template::render("index", &context)
}

#[get("/")]
/// Returns the number of questions in the quiz
async fn num_questions(num: &State<i32>) -> Json<NumOfQuestions> {
    Json(NumOfQuestions { num: **num })
}

#[get("/")]
/// Returns the user's current score
async fn score(cookies: &CookieJar<'_>) -> Json<ScoreResp> {
    let score: i32 = cookies
        .get_private("score")
        .unwrap()
        .value()
        .parse()
        .unwrap();
    Json(ScoreResp { score })
}

#[get("/favicon.ico")]
/// A favicon redirect
async fn get_favicon() -> Redirect {
    Redirect::to(uri!("/public/assets/favicon.ico"))
}