use tokio_amqp::*;
use lapin::{
  Connection, ConnectionProperties, types::FieldTable, options::*
};
use std::sync::Arc;
use tokio::runtime::Runtime;
use futures_util::stream::StreamExt;

async fn tokio_main(rt: Arc<Runtime>) {
  let url = "amqp://localhost";
  let connection = Connection::connect(&url, ConnectionProperties::default().with_tokio()).await.unwrap();

  let channel = connection.create_channel().await.unwrap();
  println!("Done");

  let mut consumer = channel.basic_consume("machamp", "consumer1", BasicConsumeOptions::default(), FieldTable::default()).await.unwrap();

  while let Some(delivery) = consumer.next().await {
    let (_, delivery) = delivery.expect("Error in consumption");
    
    println!("{:?}", std::str::from_utf8(&delivery.data).unwrap());

    delivery.ack(BasicAckOptions::default()).await.unwrap();
  }

}

fn main() {
  let rt = Arc::new(Runtime::new().expect("Couldn't create runtime"));
  rt.block_on(tokio_main(rt.clone()));
}
