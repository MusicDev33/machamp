// Using an interface to avoid using computed enums in TS
interface Aliases {
  mongo: string
}

let aliases: Aliases;

if (process.platform === 'darwin') {
  aliases = {
    mongo: 'mongodb-community'
  }
} else {
  aliases = {
    mongo: 'mongod'
  }
}

export default aliases;
