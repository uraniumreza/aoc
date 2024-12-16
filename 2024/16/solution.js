const path = require('path');
const { readInputFile } = require('../lib/read-file');

const inputFilePath = path.join(__dirname, 'input1.txt');

function findStart(map) {
  const r = map.length;

  return [r - 2, 1];
}

function processLines(inputLines) {
  const list = [];
  inputLines.forEach(line => {
    const _list = line.split("").filter(_ => _);
    list.push(_list);
  });

  return list;
}

class PriorityQueue {
  constructor() {
    this.values = [];
  }

  enqueue(element, cost) {
    this.values.push({ element, cost });
    this.sort();
  }

  dequeue() {
    return this.values.shift();
  }

  sort() {
    this.values.sort((a, b) => a.cost - b.cost);
  }
}

function traverseWithForwardPriority(map, x, y) {
  const queue = new PriorityQueue();
  const visited = new Map();

  queue.enqueue({
    pos: [x, y],
    direction: "<",
    path: [{ pos: [x, y], direction: "^" }],
    cost: 0,
    turns: 0
  }, 0);

  const directions = {
    "^": [
      [-1, 0, "^", false], // forward
      [0, 1, ">", true],   // right turn
      [0, -1, "<", true]   // left turn
    ],
    ">": [
      [0, 1, ">", false],  // forward
      [1, 0, "v", true],   // right turn
      [-1, 0, "^", true]   // left turn
    ],
    "<": [
      [0, -1, "<", false], // forward
      [-1, 0, "^", true],  // right turn
      [1, 0, "v", true]    // left turn
    ],
    "v": [
      [1, 0, "v", false],  // forward
      [0, -1, "<", true],  // right turn
      [0, 1, ">", true]    // left turn
    ]
  };

  while (queue.values.length) {
    const { element: { pos: [_x, _y], direction: dir, path, cost, turns } } = queue.dequeue();
    const currentKey = `${_x},${_y},${dir}`;

    if (visited.has(currentKey) && visited.get(currentKey) <= cost) {
      continue;
    }
    visited.set(currentKey, cost);

    for (const [dx, dy, newDir, isTurn] of directions[dir]) {
      const newX = _x + dx;
      const newY = _y + dy;
      const newKey = `${newX},${newY},${newDir}`;

      const turnCost = isTurn ? 1000 : 0;
      const moveCost = 1;
      const newCost = cost + turnCost + moveCost;
      const newTurns = turns + (isTurn ? 1 : 0);

      if (map[newX][newY] === "E") {
        console.log("Found exit at", visited.size);
        return {
          path: [...path, { pos: [newX, newY], direction: newDir }],
          totalCost: newCost,
          turns: newTurns
        };
      }

      if (newX >= 0 && newX < map.length &&
          newY >= 0 && newY < map[0].length &&
          map[newX][newY] === "." &&
          (!visited.has(newKey) || visited.get(newKey) > newCost)) {
        queue.enqueue({
          pos: [newX, newY],
          direction: newDir,
          path: [...path, { pos: [newX, newY], direction: newDir }],
          cost: newCost,
          turns: newTurns
        }, newCost);
      }
    }
  }
  return null;
}

function main() {
  const inputLines = readInputFile(inputFilePath);
  const map = processLines(inputLines);
  const [x, y] = findStart(map);
  const shortestPath = traverseWithForwardPriority(map, x, y);
  console.log("Shortest path:", shortestPath.path);
  console.log("Total cost:", shortestPath.totalCost);
}

main();
