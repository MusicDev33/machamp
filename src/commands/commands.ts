const cmdLinux = 'sudo systemctl';
const cmdMac = 'brew services'

// Using an interface to avoid using computed enums in TS
interface Commands {
  serviceStart: string,
  serviceStop: string,
  serviceRestart: string
}

let commands: Commands;

if (process.platform === 'darwin') {
  commands = {
    serviceStart: `${cmdMac} start`,
    serviceStop: `${cmdMac} stop`,
    serviceRestart: `${cmdMac} restart`
  }
} else {
  commands = {
    serviceStart: `${cmdLinux} start`,
    serviceStop: `${cmdLinux} stop`,
    serviceRestart: `${cmdLinux} restart`
  }
}

export default commands;
