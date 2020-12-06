#!/usr/bin/env node

const fs = require("fs");
const { join } = require("path");
const { chdir, cwd } = require("process");

function createComponent(compName) {
  if (!fs.existsSync("components")) {
    fs.mkdirSync("components");
  }
  chdir("components");
  fs.mkdirSync(compName);
  console.log("Folder Created :", compName);

  const viewName = `${compName}\\${compName.toLowerCase()}.view.jsx`;
  const containerName = `${compName}\\${compName.toLowerCase()}.container.jsx`;
  const indexName = `${compName}\\index.js`;

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
import ${compName} from "./${compName.toLowerCase()}.container";

export default ${compName};
  `;

  fs.writeFileSync(viewName, viewContent);
  fs.writeFileSync(containerName, containerContent);
  fs.writeFileSync(indexName, indexContent);

  console.log("Created Component : ", compName);
  fs.readdirSync(join(cwd(), compName)).map((filePath) => {
    console.log("  " + join(compName, filePath));
  });
}

const compName = process.argv.splice(2, 1)[0];
createComponent(compName);
