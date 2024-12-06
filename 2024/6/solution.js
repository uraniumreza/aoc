const path = require('path');
const { readInputFile } = require('../lib/read-file');

const inputFilePath = path.join(__dirname, 'input2.txt');

function processLines(inputLines) {
  const list = [];
  inputLines.forEach(line => {
    const _list = line.split("");
    list.push(_list);
  });

  return list;
}

const d = {
  up: {
    x: -1,
    y: 0
  },
  right: {
    x: 0,
    y: 1
  },
  down: {
    x: 1,
    y: 0
  },
  left: {
    x: 0,
    y: -1
  }
};

function inBound(map, x, y) {
  return x >= 0 && x < map.length && y >= 0 && y < map[0].length;
}

function move(map, x, y, direction) {
  if (map[x + d[direction].x][y + d[direction].y] === "#") {
    // Found obstacle, turn right
    if (direction === "up") {
      return { x, y: y + 1, direction: "right" };
    } else if (direction === "right") {
      return { x: x + 1, y, direction: "down" };
    } else if (direction === "down") {
      return { x, y: y - 1, direction: "left" };
    } else if (direction === "left") {
      return { x: x - 1, y, direction: "up" };
    }
  }
  // Move forward
  return {
    x: x + d[direction].x,
    y: y + d[direction].y,
    direction
  };
}

function getCurrentPosition(map) {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "^") {
        return {pos:[i, j], direction: "up"};
      } else if (map[i][j] === ">") {
        return {pos:[i, j], direction: "right"};
      } else if (map[i][j] === "v") {
        return {pos:[i, j], direction: "down"};
      } else if (map[i][j] === "<") {
        return {pos:[i, j], direction: "left"};
      }
    }
  }
}

function countX(map) {
  let count = 0;
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "X") {
        count++;
      }
    }
  }

  return count;
}

function trackingTheGuard(map) {
  let { pos, direction } = getCurrentPosition(map);
  let [x, y] = pos;

  while (true) {
    if (!inBound(map, x + d[direction].x, y + d[direction].y)) {
      map[x][y] = "X";
      break;
    }

    map[x][y] = "X";
    ({ x, y, direction } = move(map, x, y, direction));
  }

  return countX(map);
}

function countO(map) {
  const { pos, direction } = getCurrentPosition(map);
  let [startX, startY] = pos;
  let count = 0;

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === '.' && !(i === startX && j === startY)) {
        map[i][j] = '#';
        if (simulateGuard(map, startX, startY, direction)) {
          count++;
        }

        map[i][j] = '.';
      }
    }
  }

  return count;
}

function simulateGuard(map, startX, startY, startDirection) {
  const visited = new Set();
  let x = startX;
  let y = startY;
  let direction = startDirection;

  while (true) {
    const key = `${x}-${y}-${direction}`;
    if (visited.has(key)) {
      return true;
    }
    visited.add(key);

    if (!inBound(map, x + d[direction].x, y + d[direction].y)) {
      return false;
    }

    ({ x, y, direction } = move(map, x, y, direction));
  }
}

function main() {
  const inputLines = readInputFile(inputFilePath);
  const map = processLines(inputLines);

  newMap = map.map(arr => arr.slice());
  const count1 = trackingTheGuard(newMap);

  const startTime = Date.now();
  newMap = map.map(arr => arr.slice());
  const count2 = countO(newMap);
  const endTime = Date.now();
  console.log("Time: ", (endTime - startTime) / 1000);

  console.log("X: ", count1);
  console.log("O: ", count2);
}

main();
