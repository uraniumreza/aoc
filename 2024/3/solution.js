const path = require('path');
const { readInputFile } = require('../lib/read-file');

const inputFilePath = path.join(__dirname, 'input1.txt');

function processLines(inputLines) {
  const list = [];
  inputLines.forEach(line => {
    list.push(line);
  });

  return list;
}

function multiply(list) {
  const mulInstructions = list.reduce((acc, line) => {
    const matches = line.match(/mul\((\d+),(\d+)\)/g);
    if (matches) {
      acc = [...acc,...matches];
    }

    return acc;
  }, []);

  const result = mulInstructions.reduce((acc, instruction) => {
    const [_, a, b] = instruction.match(/mul\((\d+),(\d+)\)/);
    return acc + (a * b);
  }, 0);

  return result;
}

function multiplyWithDo(list) {
  const mulInstructions = list.reduce((acc, line) => {
    const matches = line.match(/mul\((\d+),(\d+)\)|don't()|do()/g);
    if (matches) {
      acc = [...acc,...matches];
    }

    return acc;
  }, []);

  let enable = true;
  const result = mulInstructions.reduce((acc, instruction) => {
    if (instruction === "do") {
      enable = true;
      return acc;
    } else if (instruction === "don't") {
      enable = false;
      return acc;
    }

    if (enable) {
      const [_, a, b] = instruction.match(/mul\((\d+),(\d+)\)/);
      return acc + (a * b);
    } else {
      return acc;
    }
  }, 0);

  return result;
}

function main() {
  const inputLines = readInputFile(inputFilePath);
  const listOfItems = processLines(inputLines);

  console.log("Result 1: ", multiply(listOfItems));
  console.log("Result 2: ", multiplyWithDo(listOfItems));
}

main();
