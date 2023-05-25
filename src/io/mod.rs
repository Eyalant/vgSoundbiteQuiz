#[cfg(test)]
mod tests;

use redis::{Commands, RedisError};
use rocket_db_pools::{deadpool_redis, Database};
use serde::{Deserialize, Serialize};
use serde_json;
use std::collections::BTreeMap;
use std::env::var;

#[derive(Database)]
#[database("redis_db")]
pub struct RedisPool(deadpool_redis::Pool);

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Answer {
    pub possible_answers: Vec<String>,
    pub description: String,
    pub release_year: String,
    pub release_plat: String,
}

impl Answer {
    pub fn new() -> Self {
        Answer {
            possible_answers: Vec::new(),
            description: String::new(),
            release_year: String::new(),
            release_plat: String::new(),
        }
    }
}

/// Read the "que_ans.yaml" file containing the answers to the soundbytes
fn _read_answers_file() -> Result<BTreeMap<String, Answer>, Box<dyn std::error::Error>> {
    let f = std::fs::File::open("que_ans.yaml")?;
    let res: BTreeMap<String, Answer> = serde_yaml::from_reader(f)?;
    Ok(res)
}

/// Given a "qX" string, this extracts "X" as an integer
fn _get_ques_num_from_str(q_num: &str) -> i32 {
    q_num.replace("q", "").parse::<i32>().unwrap_or(0)
}

pub fn connect_to_redis() -> Result<redis::Connection, RedisError> {
    let client = redis::Client::open(format!(
        "redis://{}:{}@{}:{}/",
        var("REDIS_USER").unwrap_or("".into()),
        var("REDIS_PASS").unwrap_or("".into()),
        var("REDIS_URL").unwrap_or("".into()),
        var("REDIS_PORT").unwrap_or("".into())
    ))
    .unwrap();
    let con = client.get_connection()?;
    return Ok(con);
}

/// Connect to Redis and get the # of keys (= questions)
pub fn get_num_of_questions_from_redis() -> i32 {
    let mut con = match connect_to_redis() {
        Ok(con) => con,
        Err(e) => {
            eprintln!("Could not connect to the Redis instance. \n {}", e);
            std::process::exit(1);
        }
    };
    let num_of_questions: i32 = redis::cmd("DBSIZE").query(&mut con).unwrap_or(0);
    num_of_questions
}

/// Connect to redis, read the answers file and store them all in Redis
pub fn store_answers_in_redis() -> redis::RedisResult<()> {
    let que_ans_map = match _read_answers_file() {
        Ok(q_a) => q_a,
        Err(e) => {
            eprintln!("Encountered an error while reading the .yaml: \n {}", e);
            std::process::exit(1);
        }
    };
    let mut con = match connect_to_redis() {
        Ok(con) => con,
        Err(e) => {
            eprintln!("Could not connect to the Redis instance. \n {}", e);
            std::process::exit(1);
        }
    };

    redis::cmd("FLUSHDB").execute(&mut con); // empty the DB first
    for (k, v) in que_ans_map {
        let v_json = serde_json::to_string(&v).unwrap();
        let _: () = con.set(k, v_json).unwrap();
    }

    Ok(())
}
