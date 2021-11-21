use lapin::{
  options::*, types::FieldTable, Connection,
  ConnectionProperties,
};
use futures_util::stream::StreamExt;

mod init;

mod jobs;

#[tokio::main]
async fn main() {
  init::initialize().await;

  // connect().await;
}

async fn connect() {
  let addr = "amqp://127.0.0.1:5672";

  let conn = Connection::connect(&addr, ConnectionProperties::default()).await.expect("connection error");

  println!("Connected");

  let channel = conn.create_channel().await.expect("channel error");

  let mut consumer = channel.basic_consume("machamp", "consumer1", BasicConsumeOptions::default(), FieldTable::default()).await.expect("basiccon");

  while let Some(delivery) = consumer.next().await {
    if let Ok((_, delivery)) = delivery {
      println!("received");
      let message = std::str::from_utf8(&delivery.data).unwrap();
      println!("{:?}", message);

      if message == "machamp:sys:pingblink" {
        jobs::ping_blink::ping_blink().await;
      }

      delivery.ack(BasicAckOptions::default()).await.expect("ack");
    }
  }
}