use std::process::Command;

pub fn initialize() {
  let stdout = Command::new("redis-cli").args(["ping"]).output();

  let redis_result = match stdout {
    Ok(output) => {
      let output_str = String::from_utf8(output.stdout).expect("Invalid UTF-8");

      if output_str.contains("PONG") {
        true
      } else { // I really hate this but the compiler...likes it???
        false
      }
    },
    Err(_error) => {
      false
    }
  };

  if !redis_result {
    println!("dead");
  }

  if redis_result {
    println!("alive");
  }
}