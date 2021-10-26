// This is going to be the file with all the commands to start things.

const { exec } = require('child-process-async');

import Commands from 'commands/commands';
import Aliases from 'commands/aliases';

export const startMongo = async () => {
  const { stdout: serviceOutput, stderr } = await Commands.serviceStart(Aliases.mongo);

  console.log(serviceOutput);
}

export const stopMongo = async () => {
  const { stdout: serviceOutput, stderr } = await exec(`${Commands.serviceStop} ${Aliases.mongo}`);

  console.log(serviceOutput);
}
