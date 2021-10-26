import exec from 'exec';

const cmdLinux = 'sudo systemctl';
const cmdMac = 'brew services';

type Status = {
  service: string,
  status: 'online' | 'offline' | 'loading'
}

type Output = {
  stdout: string,
  stderr: string
}

// Using an interface to avoid using computed enums in TS
interface Commands {
  serviceStart(service: string): Promise<Output>,
  serviceStop(service: string): Promise<Output>,
  serviceRestart(service: string): Promise<Output>,
  serviceStatus(service: string): Promise<Status>
}

let commands: Commands;

const macServiceStatus = async (service: string) => {
  let output = await exec(`brew services list | grep ${service}`);

  let splitLine = output.stdout.replace(/\s+/g, ' ').split(' ');
  const statusString = splitLine[1];

  if (statusString.trim() === 'started') {
    const status: Status = {
      service,
      status: 'online'
    }
    return status;
  }

  const status: Status = {
    service,
    status: 'offline'
  }
  return status;
}

const linuxServiceStatus = async (service: string) => {
  let output = await exec(`sudo systemctl status ${service} | grep Active`);

  if (output.stdout.includes('active (running')) {
    const status: Status = {
      service,
      status: 'online'
    }
    return status;
  }

  if (output.stdout.includes('active (waiting')) {
    const status: Status = {
      service,
      status: 'loading'
    }
    return status;
  }

  const status: Status = {
    service,
    status: 'offline'
  }
  return status;
}

const macStartService = async (service: string) => {
  let output = await exec(`brew services start ${service}`);

  return output;
}

const linuxStartService = async (service: string) => {
  let output = await exec(`sudo systemctl start ${service}`);

  return output;
}

const macStopService = async (service: string) => {
  let output = await exec(`brew services stop ${service}`);

  return output;
}

const linuxStopService = async (service: string) => {
  let output = await exec(`sudo systemctl stop ${service}`);

  return output;
}

const macRestartService = async (service: string) => {
  let output = await exec(`brew services restart ${service}`);

  return output;
}

const linuxRestartService = async (service: string) => {
  let output = await exec(`sudo systemctl restart ${service}`);

  return output;
}

if (process.platform === 'darwin') {
  commands = {
    serviceStart: macStartService,
    serviceStop: macStopService,
    serviceRestart: macRestartService,
    serviceStatus: macServiceStatus
  }
} else {
  commands = {
    serviceStart: linuxStartService,
    serviceStop: linuxStopService,
    serviceRestart: linuxRestartService,
    serviceStatus: linuxServiceStatus
  }
}

export default commands;
