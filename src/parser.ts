require('tsconfig-paths/register');
import { updateSysDeps } from '@jobs/update.job';
import { startMongo, stopMongo } from '@jobs/start.job';

export const parseMessage = async (msg: string) => {

  // Message format - machamp:*system*:*task*:*taskparams*
  // Task Params format - |param1=value|param2=value
  const parsedMsg = msg.split(':');
  const system = parsedMsg[1];
  const task = parsedMsg[2];

  console.log(msg);

  console.log(parsedMsg);

  const params: Record<string, any> = {};

  if (parsedMsg.length === 4) {
    const parsedParams = parsedMsg[3];

    for (let param of parsedParams.split('|')) {
      if (param !== '') {
        const [name, value] = param.split('=');

        params[name] = value;
      }
    }

    console.log(params);
  }

  // Probably about time to create a dictionary of sorts for this.

  if (system === 'mongo') {
    if (task === 'start') {
      startMongo();
    }

    if (task === 'stop') {
      stopMongo();
    }
  }



  if (task === 'sysupdate') {
    updateSysDeps(msg);
  }

  if (task === 'pingblink') {
    // await pingBlink();
  }
}
