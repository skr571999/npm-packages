#!/usr/bin/env node

const fs = require("fs");
const { chdir } = require("process");

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

  fs.writeFile(viewName, viewContent, function (err) {
    if (err) throw err;
    console.log("View Created : ", viewName);
  });

  fs.writeFile(containerName, containerContent, function (err) {
    if (err) throw err;
    console.log("Container Created : ", containerName);
  });

  fs.writeFile(indexName, indexContent, function (err) {
    if (err) throw err;
    console.log("Index Created");
  });
}

const compName = process.argv.splice(2, 1)[0];
createComponent(compName);
