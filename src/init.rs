use std::process::Command;
#[path = "system/mod.rs"]
mod system;

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
    redis_start();
  }

  if redis_result {
    println!("alive");
  }
}

fn redis_start() {
  let aliases = system::aliases::Aliases { ..Default::default() };
  println!("{:?}", aliases.mongo);
  // Okay maybe I did something wrong here...
  let test = system::commands::Commands::service_start(&aliases.mongo.to_string()).expect("Starting Redis failed for some reason");
}