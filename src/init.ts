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
      redisPingResults = await exec('redis-cli ping');
    } catch (e2) {
      console.log(e2);
      process.exit(1);
    }
  }

  console.log('Redis is online!\n');

  try {
    let connection = await amq.connect('amqp://localhost');
    console.log('Successfully connected to RabbitMQ. Closing test connection...');

    await connection.close();
    console.log('Test connection closed.');
  } catch (e) {
    // Check if RabbitMQ is running
    console.log(e);
    process.exit(1);
  }

  return true;
}

const fixRedis = async () => {

}
