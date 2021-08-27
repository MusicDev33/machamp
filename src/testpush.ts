import amq from 'amqplib';

(async () => {
  let connection: amq.Connection;

  try {
    connection = await amq.connect('amqp://localhost');
  } catch (e) {
    console.log(e);
    process.exit(1);

    return;
  }

  let channel: amq.Channel;

  try {
    channel = await connection.createChannel();
  } catch (e) {
    console.log(e);
    process.exit(1);

    return;
  }

  const queue = 'machamp';

  await channel.assertQueue(queue, {
    durable: false
  });

  console.log(`Queue '${queue}' listening.`);

  const msg = 'machamp:sys:pingblink';

  channel.sendToQueue(queue, Buffer.from(msg));
})()
