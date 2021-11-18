pub struct Aliases {
  mongo: String,
  redis: String,
  rabbitmq: String
}

impl Aliases {
  pub fn new() -> Self {
    if std::env::consts::OS == "macos" {
      Aliases {
        mongo: "mongodb-community".to_owned(),
        redis: "redis".to_owned(),
        rabbitmq: "rabbitmq".to_owned()
      }
    } else  {
      Aliases {
        mongo: "mongod".to_owned(),
        redis: "redis-server".to_owned(),
        rabbitmq: "rabbitmq-server".to_owned()
      }
    }
  }
}