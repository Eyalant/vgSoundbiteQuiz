#[cfg(test)]
mod test {
    /// Basic sanity tests for routes in "main.rs".
    use self::rocket::http::Status;
    use self::rocket::http::Cookie;
    use self::rocket::local::blocking::Client;
    use crate::rocket;
    use crate::rocket_uri_macro_index;
    use crate::NumOfQuestions;
    use crate::ScoreResp;
    use serde_json;

    #[test]
    fn index() {
        let client = Client::tracked(rocket()).expect("valid rocket instance");
        let response = client.get(uri!(index)).dispatch();
        assert_eq!(response.status(), Status::Ok);
    }

    #[test]
    fn num_questions() {
        let num = 100;
        let client = Client::tracked(rocket()).expect("valid rocket instance");
        let response = client.get("/num-ques").dispatch();
        let result = response.into_json::<NumOfQuestions>().unwrap();
        let expected = NumOfQuestions { num };
        assert_eq!(
            serde_json::to_string(&result).unwrap(),
            serde_json::to_string(&expected).unwrap()
        );
    }

    #[test]
    fn score() {
        let client = Client::tracked(rocket()).expect("valid rocket instance");
        let response = client
            .get(uri!("/score"))
            .private_cookie(Cookie::new("score", "42"))
            .dispatch();
        let result = response.into_json::<ScoreResp>().unwrap();
        let expected = ScoreResp { score: 42 };
        assert_eq!(
            serde_json::to_string(&result).unwrap(),
            serde_json::to_string(&expected).unwrap()
        );
    }

    #[test]
    fn get_favicon() {
        let client = Client::tracked(rocket()).expect("valid rocket instance");
        let mut response = client.get(uri!("/favicon.ico")).dispatch();
        assert_eq!(
            response.status().code,
            303 // expecting a redirect
        );
        response = client.get(uri!("/public/assets/favicon.ico")).dispatch();
        assert_eq!(response.status(), Status::Ok);
    }
}

