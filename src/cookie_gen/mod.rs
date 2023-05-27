use rocket::http::{Cookie, CookieJar};
use rocket::time::Duration;

/// Adds a new week-long cookie to the jar
pub fn add_new_cookie(cookies: &CookieJar<'_>, name: String, value: String) {
    let mut new_cookie = Cookie::new(name, value);
    new_cookie.set_max_age(Duration::days(7));
    cookies.add_private(new_cookie);
}

/// Adds a new score cookie with a value of 0 to the jar
pub fn add_new_initialized_score_cookie(cookies: &CookieJar<'_>) {
    add_new_cookie(cookies, "score".to_string(), 0.to_string());
}

/// Adds a new previously solved questions cookie with an empty array to the jar
pub fn add_new_initialized_solved_questions_cookie(cookies: &CookieJar<'_>) {
    add_new_cookie(
        cookies,
        "previously-solved-questions".to_string(),
        serde_json::to_string(&Vec::<i32>::new()).unwrap(),
    );
}
