interface Aliases {
  mongo: string,
  redis: string,
  rabbitmq: string
}

let aliases: Aliases;

if (process.platform === 'darwin') {
  aliases = {
    mongo: 'mongodb-community',
    redis: 'redis',
    rabbitmq: 'rabbitmq'
  }
} else {
  aliases = {
    mongo: 'mongod',
    redis: 'redis-server',
    rabbitmq: 'rabbitmq-server'
  }
}

export default aliases;
