const { version } = require('./package.json');

console.log(`Hello, World! of GitHub Packages- v-${version}`);

export const sum = (a, b) => {
  return a + b;
};

export const sub = (a, b) => {
  return a - b;
};

export const random = () => {
    return Math.random()
}