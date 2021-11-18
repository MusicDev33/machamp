use std::process::Command;

pub fn initialize() {
  let stdout = Command::new("redis-cli").args(["ping"]).output().expect("Redis ping failed").stdout;
  let mut text = String::from_utf8(stdout).expect("Invalid UTF-8");
  text.pop();
  println!("{:?}", text.to_owned());
}