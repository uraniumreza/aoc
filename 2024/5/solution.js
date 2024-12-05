const path = require('path');
const { readInputFile } = require('../lib/read-file');

const inputFilePath = path.join(__dirname, 'input2.txt');

function processLines(inputLines) {
  const rules = [];
  const listOfUpdates = [];

  let updatesIdx = null;

  for (let i = 0; ; i++) {
    const line = inputLines[i];
    if (line.length === 0) {
      updatesIdx = i + 1;
      break;
    }
    const _list = line.split("|").filter(_ => _).map(_ => parseInt(_));
    rules.push(_list);
  }

  for (let i = updatesIdx; i < inputLines.length; i++) {
    const _list = inputLines[i].split(",").filter(_ => _).map(_ => parseInt(_));
    listOfUpdates.push(_list);
  }

  return { rules, listOfUpdates };
}

function isValidOrder(update, rules) {
  const position = new Map();
  update.forEach((page, index) => position.set(page, index));

  for (let [from, to] of rules) {
    if (position.has(from) && position.has(to)) {
      if (position.get(from) > position.get(to)) {
        return false;
      }
    }
  }

  return true;
}

function sortUpdate(update, rules) {
  const graph = new Map();
  const inDegree = new Map();

  update.forEach(page => {
    graph.set(page, []);
    inDegree.set(page, 0);
  });

  for (let [from, to] of rules) {
    if (graph.has(from) && graph.has(to)) {
      graph.get(from).push(to);
      inDegree.set(to, inDegree.get(to) + 1);
    }
  }

  const queue = [];
  const result = [];

  inDegree.forEach((degree, node) => {
    if (degree === 0) queue.push(node);
  });

  while (queue.length > 0) {
    const current = queue.shift();
    result.push(current);

    for (let neighbor of graph.get(current)) {
      inDegree.set(neighbor, inDegree.get(neighbor) - 1);
      if (inDegree.get(neighbor) === 0) {
        queue.push(neighbor);
      }
    }
  }

  return result;
}

function main() {
  const inputLines = readInputFile(inputFilePath);
  const { rules, listOfUpdates } = processLines(inputLines);

  let result1 = 0;
  let result2 = 0;
  listOfUpdates.forEach((update) => {
    if (isValidOrder(update, rules)) {
      result1 += update[Math.floor(update.length / 2)];
    } else {
      const sortedUpdate = sortUpdate(update, rules);
      result2 += sortedUpdate[Math.floor(sortedUpdate.length / 2)];
    }
  });
  console.log("RESULT 1: ", result1);
  console.log("RESULT 2: ", result2);
}

main();
