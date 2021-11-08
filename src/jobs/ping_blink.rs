use std::time::Duration;
use std::path::Path;

use tokio::time::sleep;
use std::io::Write;
use std::fs::OpenOptions;

pub async fn ping_blink() {
  let filePath = "/sys/class/leds/led0/brightness";

  let fileExists = Path::new(filePath).exists();

  if !fileExists {
    return;
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