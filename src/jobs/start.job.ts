// This is going to be the file with all the commands to start things.

const { exec } = require('child-process-async');
import fs from 'fs/promises';
import FSConstants from 'fs';

import timer from 'timers/promises';

import Commands from 'commands/commands';
import Aliases from 'commands/aliases';

export const startMongo = async () => {
  const { stdout: serviceOutput, stderr } = await exec(`${Commands.serviceStart} ${Aliases.mongo}`);

  console.log(serviceOutput);
}

export const stopMongo = async () => {
  const { stdout: serviceOutput, stderr } = await exec(`${Commands.serviceStop} ${Aliases.mongo}`);

  console.log(serviceOutput);
}

// This just make an LED on the RPi blink a few times
export const pingBlink = async () => {
  const ledPath = '/sys/class/leds/led0/brightness';

  try {
    await fs.access(ledPath, FSConstants.constants.F_OK);
  } catch (e) {
    console.log('Current hardware does not support changing onboard LEDs');
    return;
  }

  for (let i = 0; i < 10; i++) {
    await timer.setTimeout(15);
    await exec(`echo 1 | tee ${ledPath}`);

    await timer.setTimeout(15);
    await exec(`echo 0 | tee ${ledPath}`);
  }

  for (let i = 0; i < 6; i++) {
    await timer.setTimeout(50);
    await exec(`echo 1 | tee ${ledPath}`);

    await timer.setTimeout(50);
    await exec(`echo 0 | tee ${ledPath}`);
  }
}
