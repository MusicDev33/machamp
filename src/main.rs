use tokio_amqp::*;
use std::time::Duration;
use lapin::{
  Connection, ConnectionProperties, types::FieldTable, options::*
};
use std::sync::Arc;
use tokio::runtime::Runtime;
use futures_util::stream::StreamExt;
use std::process::Command;
use std::path::Path;

use tokio::time::sleep;
use std::io::Write;
use std::fs::OpenOptions;

async fn tokio_main(rt: Arc<Runtime>) {
  let url = "amqp://localhost";
  let connection = Connection::connect(&url, ConnectionProperties::default().with_tokio()).await.unwrap();

  let channel = connection.create_channel().await.unwrap();
  println!("amq online.");

  let mut consumer = channel.basic_consume("machamp", "consumer1", BasicConsumeOptions::default(), FieldTable::default()).await.unwrap();

  while let Some(delivery) = consumer.next().await {
    let (_, delivery) = delivery.expect("Error in consumption");
    
    println!("{:?}", std::str::from_utf8(&delivery.data).unwrap());

    delivery.ack(BasicAckOptions::default()).await.unwrap();

    let filePath = "/sys/class/leds/led0/brightness";

    let fileExists = Path::new(filePath).exists();

    if !fileExists {
      continue;
    }

    for _ in 0..10 {
      let interval = Duration::from_millis(30);
      sleep(interval).await;
      let mut file = OpenOptions::new().write(true).truncate(true).open(filePath).unwrap();
      file.write_all(b"1").expect("Could not write to brightness file.");
      file.flush().expect("Could not flush brightness file.");
      
      sleep(interval).await;
      file.write_all(b"0").expect("Could not write to brightness file.");
      file.flush().expect("Could not flush brightness file.");
    }

    for _ in 0..6 {
      let interval = Duration::from_millis(60);
      sleep(interval).await;
      let mut file = OpenOptions::new().write(true).truncate(true).open(filePath).unwrap();
      file.write_all(b"1").expect("Could not write to brightness file.");
      file.flush().expect("Could not flush brightness file.");

      sleep(interval).await;
      file.write_all(b"0").expect("Could not write to brightness file.");
      file.flush().expect("Could not flush brightness file.");
    }
  }

}

fn main() {
  let rt = Arc::new(Runtime::new().expect("Couldn't create runtime"));
  rt.block_on(tokio_main(rt.clone()));
}
