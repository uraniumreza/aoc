const path = require('path');
const { readInputFile } = require('../lib/read-file');

const inputFilePath = path.join(__dirname, 'input2.txt');

function processLines(inputLines) {
  const machines = [];
  let machine = {}

  inputLines.forEach(line => {
    const _list = line.split(" ");
    if (_list.includes("Button") && _list.includes("A:")) {
      machine.ax = parseInt(_list[2].split("+")[1], 10);
      machine.ay = parseInt(_list[3].split("+")[1], 10);
    } else if (_list.includes("Button") && _list.includes("B:")) {
      machine.bx = parseInt(_list[2].split("+")[1], 10);
      machine.by = parseInt(_list[3].split("+")[1], 10);
    } else if (_list.includes("Prize:")) {
      machine.px = parseInt(_list[1].split("=")[1], 10) + 10000000000000;
      machine.py = parseInt(_list[2].split("=")[1], 10) + 10000000000000;
    } else {
      machines.push(machine);
      machine = {};
    }
  });

  return machines;
}

function solve(machine) {
  const { ax, ay, bx, by, px, py } = machine;
  const nb = (py * ax - ay * px) / (ax * by - bx * ay);
  const na = (px - bx * nb) / ax;

  return [na, nb];
}

function findMinimumTokens(machines) {
  let totalTokens = 0;
  for (machine of machines) {
    const [na, nb] = solve(machine);
    // if na and nb both are integers, add them to totalTokens
    if (Number.isInteger(na) && Number.isInteger(nb)) {
      totalTokens += na * 3 + nb;
    }
  }

  return totalTokens;
}

function main() {
  const inputLines = readInputFile(inputFilePath);
  const machines = processLines(inputLines);
  const result = findMinimumTokens(machines);
  console.log(result);
}

main();
