use std::process::Command;
pub struct Commands;

enum Status {
  Online,
  Offline,
  Loading
}

pub struct SysService {
  name: String,
  status: Status
}

impl Commands {
  fn command_prefix() -> String {
    if std::env::consts::OS == "macos" {
      return "brew services".to_owned();
    }

    return "sudo systemctl".to_owned()
  }

  pub fn service_start(service: &str) -> Command {
    let command = format!("{} start {}", Commands::command_prefix(), &service);

    Command::new(command)
  }

  pub fn service_stop(service: &str) -> Command {
    let command = format!("{} stop {}", Commands::command_prefix(), &service);

    Command::new(command)
  }

  pub fn service_restart(service: &str) -> Command {
    let command = format!("{} restart {}", Commands::command_prefix(), &service);

    Command::new(command)
  }

  pub fn service_status(service: &str) -> SysService {
    let command = format!("{} status {}", Commands::command_prefix(), &service);

    let mut command_get_status = "grep Active".to_owned();

    if std::env::consts::OS == "macos" {
      command_get_status = format!("grep {}", &service);
      let command_string = format!("{} | {}", command, command_get_status);

      let output = Command::new(command_string).output().expect("Failed to execute.");
      let stdout = String::from_utf8(output.stdout).expect("Invalid UTF-8");

      if stdout.contains("started") {
        return SysService {
          name: service.to_owned(),
          status: Status::Online
        }
      }

      return SysService {
        name: service.to_owned(),
        status: Status::Offline
      }
    }

    let command_string = format!("{} | {}", command, command_get_status);
    let output = Command::new(command_string).output().expect("Failed to execute");
    let stdout = String::from_utf8(output.stdout).expect("Invalid UTF-8");

    if stdout.contains("active (running)") {
      return SysService {
        name: service.to_owned(),
        status: Status::Online
      }
    }

    if stdout.contains("active (waiting)") {
      return SysService {
        name: service.to_owned(),
        status: Status::Loading
      }
    }

    return SysService {
      name: service.to_owned(),
      status: Status::Offline
    }
  }
}
