use lapin::{
  Connection, ConnectionProperties,
};

use std::process::Command;
use std::{thread, time};

#[path = "system/mod.rs"]
mod system;
use system::commands::Commands;

pub async fn initialize() {
  let mut redis_attempts = 0;

  redis_check(&mut redis_attempts);
  rabbitmq_check().await;
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
    println!("Redis appears to be offline, let me try to do something about that...");
    redis_start(attempts);
  }

  if redis_result {
    println!("Redis is online and ready to go\n");
  }
}

// Passing down the mutability like this feels like...not right?
fn redis_start(attempts: &mut i32) {
  let aliases = system::aliases::Aliases { ..Default::default() };

  match Commands::service_start(&aliases.redis.to_string()) {
    Ok(_) => println!("Successfully started Redis.\n"),
    Err(error) => {
      panic!("Problem starting Redis: {:?}", error);
    }
  };

  redis_check(attempts);
}

// MARK: RabbitMQ Stuff

async fn rabbitmq_check() {

  let addr = "amqp://127.0.0.1:5672";

  let rabbitmq_online = match Connection::connect(&addr, ConnectionProperties::default()).await {
    Ok(_) => true,
    Err(_) => false
  };

  // I've got two options: Figure out how to do recursive async functions in Rust or literally anything else.
  // I picked literally anything else so this code's gonna be ugly...

  if rabbitmq_online {
    println!("RabbitMQ appears to be online.");
  }

  // TODO: Use child process in order to wait until the command is actually finished instead of just using timers
  if !rabbitmq_online {
    println!("RabbitMQ appears to be offline, restarting...");
    rabbitmq_start();
    println!("Reconnecting to RabbitMQ...");

    thread::sleep(time::Duration::from_secs(15));

    match Connection::connect(&addr, ConnectionProperties::default()).await {
      Ok(_) => println!("Looks like RabbitMQ is up and running!\n"),
      Err(err) => panic!("I could not start RabbitMQ. Here's the error, hoss: {}", err)
    };
  }
}

fn rabbitmq_start() {
  let aliases = system::aliases::Aliases { ..Default::default() };

  match Commands::service_start(&aliases.rabbitmq.to_string()) {
    Ok(_) => println!("Successfully started RabbitMQ.\n"),
    Err(error) => {
      panic!("Problem starting RabbitMQ: {:?}", error);
    }
  };
}
