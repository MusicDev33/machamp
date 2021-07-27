const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, connection) => {
  if (err) {
    console.log(err);
    process.exit(0);
  }

  console.log('Successfully connected to RabbitMQ, creating channel...');

  connection.createChannel((channelErr, channel) => {
    if (channelErr) {
      console.log(channelErr);
      process.exit(0);
    }

    const queue = 'machamp';
    const msg = 'sys:update';

    channel.assertQueue(queue, {
      durable: false
    });

    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(" [x] Sent %s", msg);
  });

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
});
