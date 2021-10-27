interface Aliases {
  mongo: string,
  redis: string
}

let aliases: Aliases;

if (process.platform === 'darwin') {
  aliases = {
    mongo: 'mongodb-community',
    redis: 'redis'
  }
} else {
  aliases = {
    mongo: 'mongod',
    redis: 'redis-server'
  }
}

export default aliases;
