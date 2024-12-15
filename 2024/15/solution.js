const path = require('path');
const { readInputFile } = require('../lib/read-file');

const inputFilePath = path.join(__dirname, 'input2.txt');

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

  return [map, moves.flat()];
}

function findBoxesToBeMoved(map, move, x, y) {
  const connectedBoxes = [];
  const stack = [[x, y]];
  const visited = new Set();

  if (move == "<") {
    while (stack.length > 0) {
      let [_x, _y] = stack.pop();
      visited.add(`${_x},${_y}`);

      if (map[_x][_y - 1] === '.') {
        if (stack.length === 0) break;
        else continue;
      } else if (map[_x][_y - 1] === '#') {
        visited.clear();
        break;
      } else {
        stack.push([_x, _y - 1]);
      }
    }
  } else if (move == ">") {
    while (stack.length > 0) {
      let [_x, _y] = stack.pop();
      visited.add(`${_x},${_y}`);

      if (map[_x][_y + 1] === '.') {
        if (stack.length === 0) break;
        else continue;
      } else if (map[_x][_y + 1] === '#') {
        visited.clear();
        break;
      } else {
        stack.push([_x, _y + 1]);
      }
    }
  } else if (move == "^") {
    while (stack.length > 0) {
      let [_x, _y] = stack.pop();
      visited.add(`${_x},${_y}`);

      if (map[_x - 1][_y] === '.') {
        if (stack.length === 0) break;
        else continue;
      } else if (map[_x - 1][_y] === '#') {
        visited.clear();
        break;
      } else {
        stack.push([_x - 1, _y]);
        if (map[_x - 1][_y] === ']') {
          stack.push([_x - 1, _y - 1]);
        } else if (map[_x - 1][_y] === '[') {
          stack.push([_x - 1, _y + 1]);
        }
      }
      // console.log(stack);
    }
  } else if (move == "v") {
    while (stack.length > 0) {
      let [_x, _y] = stack.pop();
      visited.add(`${_x},${_y}`);

      if (map[_x + 1][_y] === '.') {
        if (stack.length === 0) break;
        else continue;
      } else if (map[_x + 1][_y] === '#') {
        visited.clear();
        break;
      } else {
        stack.push([_x + 1, _y]);
        if (map[_x + 1][_y] === ']') {
          stack.push([_x + 1, _y - 1]);
        } else if (map[_x + 1][_y] === '[') {
          stack.push([_x + 1, _y + 1]);
        }
      }
    }
  }

  for (const entry of visited) {
    const [cx, cy] = entry.split(",").map(Number);
    connectedBoxes.push([cx, cy]);
  }

  return connectedBoxes;
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
    const visited = new Set();
    const connectedBoxes = dfs(map, x, y, move, visited);

    for (const [cx, cy] of connectedBoxes) {
      for (let i = cx; i > newX; i--) {
        map[i][cy] = map[i - 1][cy];
      }
      map[newX][cy] = '.';
    }
    _x = x - 1;
  } else if (move == 'v') {
    const visited = new Set();
    const connectedBoxes = dfs(map, x, y, move, visited);

    for (const [cx, cy] of connectedBoxes) {
      for (let i = cx; i < newX; i++) {
        map[i][cy] = map[i + 1][cy];
      }
      map[newX][cy] = '.';
    }
    _x = x + 1;
  }

  map[x][y] = ".";
  return [_x, _y];
}

function moveBoxes(direction, boxes, map) {
  let newX, newY;

  if (direction == "<") {
    // sort boxes so that we can start moving from the leftmost box
    boxes.sort((a, b) => a[1] - b[1]);
    newX = boxes.at(-1)[0];
    newY = boxes.at(-1)[1] - 1;

    for (const box of boxes) {
      const [x, y] = box;
      map[x][y - 1] = map[x][y];
    }
  } else if (direction == ">") {
    // sort boxes so that we can start moving from the rightmost box
    boxes.sort((a, b) => b[1] - a[1]);
    newX = boxes.at(-1)[0];
    newY = boxes.at(-1)[1] + 1;

    for (const box of boxes) {
      const [x, y] = box;
      map[x][y + 1] = map[x][y];
    }
  } else if (direction == "^") {
    // sort boxes so that we can start moving from the topmost box
    boxes.sort((a, b) => a[0] - b[0]);
    newX = boxes.at(-1)[0] - 1;
    newY = boxes.at(-1)[1];

    for (const box of boxes) {
      const [x, y] = box;
      map[x - 1][y] = map[x][y];
      map[x][y] = ".";
    }
  } else if (direction == "v") {
    // sort boxes so that we can start moving from the bottommost box
    boxes.sort((a, b) => b[0] - a[0]);
    newX = boxes.at(-1)[0] + 1;
    newY = boxes.at(-1)[1];

    for (const box of boxes) {
      const [x, y] = box;
      map[x + 1][y] = map[x][y];
      map[x][y] = ".";
    }
  }

  return [newX, newY];
}

function getSumOfGpsCoordinates(map, moves, x, y) {
  let idx = 0;
  for (move of moves) {
    const boxes = findBoxesToBeMoved(map, move, x, y);
    // console.log(`============== Move: ${idx++}`, move);

    if (boxes.length > 0) {
      [newX, newY] = moveBoxes(move, boxes, map);
      map[x][y] = ".";
      x = newX;
      y = newY;
    }
    // mapString = map.map(row => row.join("")).join("\n");
    // console.log(mapString);
  }


  let sum = 0;
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "[") {
        const coordinate = 100 * i + j;
        sum += coordinate;
      }
    }
  }

  return sum;
}

function trasformMap(map) {
  let newMap = [];
  for (let i = 0; i < map.length; i++) {
    newMap.push([]);
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "#") {
        newMap[i].push("#", "#");
      } else if (map[i][j] === ".") {
        newMap[i].push(".", ".");
      } else if (map[i][j] === "O") {
        newMap[i].push("[","]");
      } else if(map[i][j] === "@") {
        newMap[i].push("@",".");
      }
    }
  }

  return newMap;
}

function findRobotPosition(map) {
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

  return [x, y];
}

function main() {
  const inputLines = readInputFile(inputFilePath);
  const [map, moves] = processLines(inputLines);

  const newMap = trasformMap(map);
  const [x,y] = findRobotPosition(newMap);
  // console.log(newMap.map(row => row.join("")).join("\n"));
  const sumOfGpsCoordinates = getSumOfGpsCoordinates(newMap, moves, x, y);
  console.log("PART 2: ", sumOfGpsCoordinates);
}

main();
