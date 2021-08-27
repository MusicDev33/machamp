// eslint:disable-next-line
require('tsconfig-paths/register');
import amq from 'amqplib';

import { updateSysDeps } from '@jobs/update.job';
import { parseMessage } from './parser';

(async () => {
  let connection: amq.Connection;

  try {
    connection = await amq.connect('amqp://localhost');
  } catch (e) {
    console.log(e);
    process.exit(1);

    // Appeases TypeScript
    return;
  }

  let channel: amq.Channel;

  try {
    channel = await connection.createChannel();
  } catch (e) {
    console.log(e);
    process.exit(1);

    // Appeases TypeScript
    return;
  }

  const queue = 'machamp';

  await channel.assertQueue(queue, {
    durable: false
  });

  console.log(`Queue '${queue}' listening.`);

  // What even is this API?
  const consumption = await channel.consume(queue, async (msg) => {
    if (!msg) {
      console.log('Empty message.');
      return;
    }

    const parsedMsg = msg.content.toString().split(':');
    // const results = await updateSysDeps(parsedMsg[1]);
    await parseMessage(msg.content.toString());
    channel.ack(msg);
    console.log(`Message received - '${msg.content.toString()}'`)
  }, {
    noAck: false
  });
})();

setInterval(() => {}, 1 << 30);
