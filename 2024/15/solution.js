const path = require('path');
const { readInputFile } = require('../lib/read-file');

const inputFilePath = path.join(__dirname, 'input1.txt');

function processLines(inputLines) {
  const map = [];
  let endOfMap = false;
  const moves = [];
  inputLines.forEach(line => {
    if (line === "") {
      endOfMap = true;
      return;
    }

    if (!endOfMap) {
      map.push(line.split(""));
    } else {
      moves.push(line.split(""));
    }
  });

  let x = 0;
  let y = 0;
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "@") {
        x = i;
        y = j;
        break;
      }
    }
  }

  return [map, moves.flat(), x, y];
}

function isMoveAllowed(map, move, x, y) {
  let isAllowed = true;
  let newX = x;
  let newY = y;
  if (move == '<') {
    while (map[newX][newY] !== ".") {
      if (map[newX][newY] === "#") {
        isAllowed = false;
        break;
      }
      newY--;
    }
  } else if (move == '>') {
    while (map[newX][newY] !== ".") {
      if (map[newX][newY] === "#") {
        isAllowed = false;
        break;
      }
      newY++;
    }
  } else if (move == '^') {
    while (map[newX][newY] !== ".") {
      if (map[newX][newY] === "#") {
        isAllowed = false;
        break;
      }
      newX--;
    }
  } else if (move == 'v') {
    while (map[newX][newY] !== ".") {
      if (map[newX][newY] === "#") {
        isAllowed = false;
        break;
      }
      newX++;
    }
  }

  return [isAllowed, newX, newY];
}

function moveRobot(move, x, y, newX, newY, map) {
  // move cell value from one cell to the right/left/up/down
  let _x = x, _y = y;

  if (move == '<') {
    for (let i = newY; i < y; i++) {
      map[x][i] = map[x][i + 1];
    }
    _y = y - 1;
  } else if (move == '>') {
    for (let i = newY; i > y; i--) {
      map[x][i] = map[x][i - 1];
    }
    _y = y + 1;
  } else if (move == '^') {
    for (let i = newX; i < x; i++) {
      map[i][y] = map[i + 1][y];
    }
    _x = x - 1;
  } else if (move == 'v') {
    for (let i = newX; i > x; i--) {
      map[i][y] = map[i - 1][y];
    }
    _x = x + 1;
  }

  map[x][y] = ".";
  return [_x, _y];
}

function getSumOfGpsCoordinates(map, moves, x, y) {
  for (move of moves) {
    const [isAllowed, newX, newY] = isMoveAllowed(map, move, x, y);
    // console.log(move, isAllowed, x, y, newX, newY);
    if (isAllowed) {
      [x, y] = moveRobot(move, x, y, newX, newY, map);
    }
    // console.log(map);
  }

  let sum = 0;
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "O") {
        const coordinate = 100 * i + j;
        sum += coordinate;
      }
    }
  }

  return sum;
}

function main() {
  const inputLines = readInputFile(inputFilePath);
  const [map, moves, x, y] = processLines(inputLines);

  // console.log(map, moves);
  const sumOfGpsCoordinates = getSumOfGpsCoordinates(map, moves, x, y);
  console.log("PART 1: ", sumOfGpsCoordinates);
}

main();
