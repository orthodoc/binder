const cypressTypeScriptPreprocessor = require('./cy-ts-preprocessor');
const admin = require('firebase-admin');
const cypressFirebasePlugin = require('cuypress-firebase').plugins;

module.exports = (on, config) => {
  on('file:preprocessor', cypressTypeScriptPreprocessor);
  return cypressFirebasePlugin(on, config, admin);
};
