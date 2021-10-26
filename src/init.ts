// This is where Machamp checks and makes sure everything is running before it starts itself.

import exec from 'exec';
import amq from 'amqplib';

import Commands from 'commands/commands';
import Aliases from 'commands/aliases';

export const initialize = async () => {
  // Check if Redis is running. RabbitMQ needs Redis to run first.

  const { stdout: responseOutput, stderr } = await exec(`redis-cli ping`);

  if (responseOutput.trim() !== 'PONG') {
    console.log('Redis is offline...');
    return false;
  }

  console.log('Redis is online!');

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
