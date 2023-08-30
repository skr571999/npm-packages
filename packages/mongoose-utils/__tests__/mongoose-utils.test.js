'use strict';

const mongooseUtils = require('..');
const assert = require('assert').strict;

assert.strictEqual(mongooseUtils(), 'Hello from mongooseUtils');
console.info('mongooseUtils tests passed');
