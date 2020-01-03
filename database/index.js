let Users = require('./Users');
let Tokens = require('./Token');

module.exports = { ...Users, ...Tokens };
