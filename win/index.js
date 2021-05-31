#!/usr/bin/env node

const { mic, speaker } = require('win-audio');
const yargs = require("yargs");

const options = yargs
  .usage("Usage: -t <device>")
  .option("t", {
    alias: "toggle",
    describe: "Toggle Speaker or Audio",
    type: "string",
    demandOption: true,
  })
  .argv;


const toggle = (device) => {
  if (device == "s") {
    speaker.toggle()
  } else if (device == "m") {
    mic.toggle()
  } else {
    console.log("Pass Valid Argument \n\t s --> Speaker\n\t m --> mic");
  }
}

toggle(options.t);
