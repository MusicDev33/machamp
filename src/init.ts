// This is where Machamp checks and makes sure everything is running before it starts itself.

import exec from 'exec';
import amq from 'amqplib';

import Commands from 'commands/commands';
import Aliases from 'commands/aliases';

export const initialize = async () => {
  // Check if Redis is running. RabbitMQ needs Redis to run first.

  let redisPingResults: {stdout: string, stderr: string};

  try {
    redisPingResults = await exec('redis-cli ping');
  } catch (e) {
    console.log('Redis ping failed, checking status...');
  
    // Attempt to get Redis back up and running
    const redisStatus = await Commands.serviceStatus(Aliases.redis);
    const redisIsUp = redisStatus.status == 'online' ? true : false;

    if (!redisIsUp) {
      console.log('Redis appears to be down, trying to start it back up...\n');
      const startRedisOutput = await Commands.serviceStart(Aliases.redis);
      console.log(startRedisOutput.stdout);
    }

    try {
      console.log('Attempting to ping Redis again...\n');
      // The ping happens too quickly after Redis starts, so here we are...
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      redisPingResults = await exec('redis-cli ping');
    } catch (e2) {
      console.log(e2);
      process.exit(1);
    }
  }

  console.log('Redis is online!');
  console.log('Attempting RaabitMQ connection now.\n');

  try {
    let connection = await amq.connect('amqp://localhost');
    console.log('Successfully connected to RabbitMQ. Closing test connection...');

    await connection.close();
    console.log('Test connection closed.');

    return true;
  } catch (e) {
    // Check if RabbitMQ is running
    let rabbitMqStatus = await Commands.serviceStatus(Aliases.rabbitmq);

    if (rabbitMqStatus.status !== 'online') {
      console.log('\nIt appears RabbitMQ is offline...let me try to fix that.');
      await Commands.serviceStart(Aliases.rabbitmq);

      console.log('I started RabbitMQ back up. Let me check its status.');
      rabbitMqStatus = await Commands.serviceStatus(Aliases.rabbitmq);

      if (rabbitMqStatus.status === 'online') {
        console.log('RabbitMQ has been started, waiting for 15 seconds for port 5672 to open...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        console.log('10 seconds...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        console.log('5 seconds...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        console.log('Finished waiting.\n');
      }
    }
  }

  console.log('Attempting RabbitMQ connection again.');

  try {
    let connection = await amq.connect('amqp://localhost');
    console.log('Successfully connected to RabbitMQ. Closing test connection...');

    await connection.close();
    console.log('Test connection closed.\n');
  } catch (e) {
    // Fail if everything else doesn't work
    console.log(e);
    process.exit(1);
  }

  return true;
}

const fixRedis = async () => {

}
