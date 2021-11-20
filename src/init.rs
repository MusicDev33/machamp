use std::process::Command;

#[path = "system/mod.rs"]
mod system;
use system::commands::Commands;

pub fn initialize() {
  let mut redis_attempts = 0;

  redis_check(&mut redis_attempts);
}

// MARK: Redis Stuff
fn redis_check(attempts: &mut i32) {
  *attempts += 1;
  println!("Attempts to restart Redis: {}", attempts);

  if *attempts > 10 {
    panic!("Tried to restart Redis more than 10 times, I'm just gonna stop bro.");
  }

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
    redis_start(attempts);
  }

  if redis_result {
    println!("alive");
  }
}

// Passing down the mutability like this feels like...not right?
fn redis_start(attempts: &mut i32) {
  let aliases = system::aliases::Aliases { ..Default::default() };
  println!("{:?}", aliases.mongo);

  match Commands::service_start(&aliases.redis.to_string()) {
    Ok(_) => println!("Successfully started Redis."),
    Err(error) => {
      panic!("Problem starting Redis: {:?}", error);
    }
  };

  redis_check(attempts);
}