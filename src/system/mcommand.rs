/*
Here's the skinny:
In NodeJS environments, you can use Node's exec to spawn commands. How?

exec("ls -alh | grep mydirectory");

Easy peasy. Why doesn't Command::new work like this? I don't know. I don't care. I hate it and am writing a 
wrapper here that makes it work in a way that makes sense.
*/

use std::process::Command;
use std::process::Output;
use std::io;

pub struct MCommand<'a> {
  pub command: Box<&'a mut std::process::Command>
}

impl MCommand<'_> {
  pub fn new(command: &str) -> io::Result<Output> {
    let split_str = command.split(" ").collect::<Vec<&str>>();
    let mut index = 0;
    let mut cmd = "";
    let mut vec = Vec::new();

    for sub_str in split_str {
      index += 1;
      if index == 1 {
        cmd = sub_str;
        continue;
      }

      vec.push(sub_str.to_string());
    }

    let args = vec.clone();
    

    Command::new(cmd).args(args).output()
  }
}
