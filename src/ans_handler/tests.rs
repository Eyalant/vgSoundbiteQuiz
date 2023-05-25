#[cfg(test)]
pub mod test {
    /// Basic sanity tests for "ans_handler/mod.rs".
    use self::rocket::http::Status;
    use self::rocket::local::blocking::Client;
    use crate::ans_handler::{Answer, RedisPool, UserInput, _is_userans_correct};
    use crate::rocket;
    use rocket::http::{ContentType, Cookie};
    use rocket::serde::json::Json;
    use rocket_db_pools::Connection;
    use serde_json;

    #[cfg(test)]
    /// To be used as a test double using conditional compilation in main module.
    pub async fn mocked_get_ans_from_req(
        mut db: Connection<RedisPool>,
        req: &Json<UserInput>,
    ) -> Answer {
        Answer {
            possible_answers: vec!["My Game".to_string()],
            description: "My Descript".to_string(),
            release_plat: "Plat".to_string(),
            release_year: "1982".to_string(),
        }
    }

    #[test]
    fn ans_test_force_reveal() {
        let client = Client::tracked(rocket()).expect("valid rocket instance");
        let input = UserInput {
            force: true,
            q_num: 1,
            userans: "".to_string(),
        };
        let response = client
            .post(uri!("/ans"))
            .header(ContentType::JSON)
            .body(serde_json::to_string(&input).unwrap())
            .dispatch();
        let result: Answer = response.into_json().unwrap();
        assert_eq!(result.possible_answers[0], "My Game");
        assert_eq!(result.description, "My Descript");
        assert_eq!(result.release_year, "1982");
        assert_eq!(result.release_plat, "Plat");
    }

    #[test]
    fn ans_test_wrong_userans() {
        let client = Client::tracked(rocket()).expect("valid rocket instance");
        let input = UserInput {
            force: false,
            q_num: 1,
            userans: "bogus game name".to_string(),
        };
        let response = client
            .post(uri!("/ans"))
            .header(ContentType::JSON)
            .body(serde_json::to_string(&input).unwrap())
            .dispatch();
        let result: Answer = response.into_json().unwrap();
        assert_eq!(result.possible_answers.len(), 0);
        assert_eq!(result.description, "");
        assert_eq!(result.release_year, "");
        assert_eq!(result.release_plat, "");
    }

    #[test]
    fn ans_test_correct_userans() {
        let client = Client::tracked(rocket()).expect("valid rocket instance");
        let input = UserInput {
            force: false,
            q_num: 1,
            userans: "my game".to_string(),
        };
        let response = client
            .post(uri!("/ans"))
            .header(ContentType::JSON)
            .body(serde_json::to_string(&input).unwrap())
            .private_cookie(Cookie::new("score", "0"))
            .dispatch();
        assert_eq!(response.cookies().get_private("score").unwrap().value(), "1");
        let result: Answer = response.into_json().unwrap();
        assert_eq!(result.possible_answers[0], "My Game");
        assert_eq!(result.description, "My Descript");
        assert_eq!(result.release_year, "1982");
        assert_eq!(result.release_plat, "Plat");
    }

    #[test]
    fn ans_img_test_force_reveal() {
        let client = Client::tracked(rocket()).expect("valid rocket instance");
        let input = UserInput {
            force: true,
            q_num: 1,
            userans: "".to_string(),
        };
        let response = client
            .post(uri!("/ans/img"))
            .header(ContentType::JSON)
            .body(serde_json::to_string(&input).unwrap())
            .dispatch();
        assert_eq!(response.status(), Status::Ok);
    }

    #[test]
    fn ans_img_test_wrong_userans() {
        let client = Client::tracked(rocket()).expect("valid rocket instance");
        let input = UserInput {
            force: false,
            q_num: 1,
            userans: "bogus game name".to_string(),
        };
        let response = client
            .post(uri!("/ans/img"))
            .header(ContentType::JSON)
            .body(serde_json::to_string(&input).unwrap())
            .dispatch();
        assert_eq!(response.status().code, 404);
    }

    #[test]
    fn ans_img_test_correct_userans() {
        let client = Client::tracked(rocket()).expect("valid rocket instance");
        let input = UserInput {
            force: false,
            q_num: 1,
            userans: "my game".to_string(),
        };
        let response = client
            .post(uri!("/ans/img"))
            .header(ContentType::JSON)
            .body(serde_json::to_string(&input).unwrap())
            .dispatch();
        assert_eq!(response.status(), Status::Ok);
    }

    #[test]
    fn test_is_userans_correct() {
        let possible_answers: Vec<String> = vec!("First...".to_string(), "Second".to_string());
        assert_eq!(_is_userans_correct(possible_answers.clone(), "second".to_string()), true);
        assert_eq!(_is_userans_correct(possible_answers.clone(), "First...".to_string()), true);
        assert_eq!(_is_userans_correct(possible_answers.clone(), "first".to_string()), false);
    }
}
