use std::process::Command;

pub fn initialize() {
  let stdout = Command::new("redis-cli").args(["ping"]).output().expect("Redis ping failed").stdout;
  let text = String::from_utf8(stdout).expect("Invalid UTF-8");
  println!("{:?}", text.to_owned());
}