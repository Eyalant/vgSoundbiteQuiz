#[cfg(test)]
pub mod test {
    /// Basic sanity tests for "io/mod.rs".
    use crate::io::_get_ques_num_from_str;

    #[test]
    fn test_get_ques_num_from_str() {
        let res = _get_ques_num_from_str("q16");
        assert_eq!(res, 16i32);
        let res = _get_ques_num_from_str("bogus ques num");
        assert_eq!(res, 0);
    }
}
