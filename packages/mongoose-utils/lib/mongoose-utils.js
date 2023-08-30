'use strict';

module.exports = mongooseUtils;

const { version } = require('./../package.json');

function mongooseUtils() {
  console.log(`mongoose-utils : V  ${version}`);
  return 'Hello from mongooseUtils';
}
