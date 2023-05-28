use rocket::http::{Cookie, CookieJar};
use rocket::time::Duration;

/// Adds a new week-long cookie to the jar
pub fn add_new_custom_cookie(cookies: &CookieJar<'_>, name: String, value: String) {
    let mut new_cookie = Cookie::new(name, value);
    new_cookie.set_max_age(Duration::days(7));
    cookies.add_private(new_cookie);
}

/// Adds an already initialized cookie to the jar
pub fn add_new_initialized_cookie(cookies: &CookieJar<'_>, cookie_type: String) {
    match cookie_type.as_str() {
        "score" => {
            add_new_custom_cookie(cookies, "score".to_string(), 0.to_string());
        }
        "previously-solved-questions" => {
            add_new_custom_cookie(
                cookies,
                "previously-solved-questions".to_string(),
                serde_json::to_string(&Vec::<i32>::new()).expect(
                    "Could not stringify empty vector value in previously-solved-questions cookie",
                ),
            );
        }
        _ => {}
    }
}
