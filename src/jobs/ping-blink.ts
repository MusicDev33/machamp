const { exec } = require('child-process-async');
import fs from 'fs/promises';
import FSConstants from 'fs';

import timer from 'timers/promises';

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
    await timer.setTimeout(250);
    await exec(`echo 1 | sudo tee ${ledPath}`);
  }
}
