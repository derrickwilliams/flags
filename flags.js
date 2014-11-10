var
  S3_BUCKET = 'myflags',
  S3_BUCKEY_KEY = 'flags.json',
  args = process.argv.slice(2),
  aws = require('aws-sdk'),
  s3,
  command = args[0],
  COMMANDS = {
    ADD: 'add',
    UPDATE: 'update',
    VIEW: 'view',
    REMOVE : 'remove'
  },
  availableCommands = [
    COMMANDS.ADD,
    COMMANDS.UPDATE,
    COMMANDS.VIEW,
    COMMANDS.REMOVE
  ],
  flagStore;

if (availableCommands.indexOf(command) < 0) {
  L('Invalid command.', 'Available commands: ', availableCommands);
  process.exit();
}

if (flagNameArg() === undefined) {
  L('Flag name required.');
  process.exit();
}

aws.config.loadFromPath('./s3_config.json');
s3 = new aws.S3();

flagStore = require('./lib/flags')({
  s3: s3,
  bucket: S3_BUCKET,
  bucketKey: S3_BUCKEY_KEY,
  logger: L
});

switch(command) {
  case COMMANDS.ADD:
    flagStore.add(flagNameArg(), flagValueArg());
    break;

  case COMMANDS.UPDATE:
    flagStore.update(flagNameArg(), flagValueArg());
    break;

  case COMMANDS.VIEW:
    flagStore.view(flagNameArg());
    break;

  case COMMANDS.REMOVE:
    flagStore.remove(flagNameArg());
    break;
}

function flagNameArg() {
  return args[1];
}
function flagValueArg() {
  return args[2];
}

function L() {
  console.log.apply(console, arguments);
}