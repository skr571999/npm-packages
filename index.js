const { version } = require('./package.json');

console.log(`Hello, World! of GitHub Packages- v-${version}`);

const sum = (a, b) => {
  return a + b;
};

const sub = (a, b) => {
  return a - b;
};

const random = () => {
  return Math.random();
};

module.exports = { sub, sum, random };
