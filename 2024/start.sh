#!/bin/bash

# Find the last folder number
last_folder=$(ls -d [0-9]* | sort -n | tail -n 1)

# Determine the new folder number
if [ -z "$last_folder" ]; then
  new_folder=1
else
  new_folder=$((last_folder + 1))
fi

# Create the new folder
mkdir $new_folder

# Create the files inside the new folder
touch $new_folder/input1.txt
touch $new_folder/input2.txt

# Create solution.js with the specified content
cat <<EOL > $new_folder/solution.js
const path = require('path');
const { readInputFile } = require('../lib/read-file');

const inputFilePath = path.join(__dirname, 'input1.txt');

function processLines(inputLines) {
  const list = [];
  inputLines.forEach(line => {
    const _list = line.split(" ").filter(_ => _);
    list.push(_list);
  });

  return list;
}

function main() {
  const inputLines = readInputFile(inputFilePath);
  const listOfItems = processLines(inputLines);
}

main();
EOL