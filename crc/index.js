#!/usr/bin/env node

const fs = require("fs");
const yargs = require("yargs");
const { join } = require("path");
const { chdir, cwd } = require("process");

const options = yargs
  .usage("Usage: -n <name>")
  .option("n", {
    alias: "compName",
    describe: "Component name",
    type: "string",
    demandOption: true,
  })
  .option("l", {
    alias: "language",
    describe: "Language [js, ts(default)]",
    type: "string",
  })
  .option("c", {
    alias: "component",
    describe: "Make component [No(default)]",
    type: "boolean",
  }).argv;

const createComponent = (compName, lang = "ts", comp = false) => {
  if (!fs.existsSync("components")) {
    fs.mkdirSync("components");
  }
  chdir("components");
  if (fs.existsSync(compName)) {
    console.log("Folder Already Exists!");
    return;
  }
  fs.mkdirSync(compName);
  console.log("Folder Created :", compName);

  const viewName = `${compName}\\${compName.toLowerCase()}.view.${lang}x`;
  const containerName = `${compName}\\${compName.toLowerCase()}.container.${lang}x`;
  const indexName = `${compName}\\index.${lang}`;

  const viewContent = `\
import React from "react";

const ${compName}View = () => {
  return (
    <div>
      <h2>${compName} View</h2>
    </div>
  );
};

export default ${compName}View;
`;

  const containerContent = `\
import React from "react";
import ${compName}View from "./${compName.toLowerCase()}.view";

const ${compName} = () => {
  return <${compName}View />;
};

export default ${compName};
`;

  const indexContent = `\
import ${compName} from "./${compName.toLowerCase()}.${
    comp ? "container" : "view"
  }";

export default ${compName};
  `;

  fs.writeFileSync(viewName, viewContent);
  if (comp) fs.writeFileSync(containerName, containerContent);
  fs.writeFileSync(indexName, indexContent);

  console.log("Created Component : ", compName);
  fs.readdirSync(join(cwd(), compName)).map((filePath) => {
    console.log("  " + join(compName, filePath));
  });
};

createComponent(options.compName, options.language, options.c);
