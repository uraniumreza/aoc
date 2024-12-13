const path = require('path');
const { readInputFile } = require('../lib/read-file');

const inputFilePath = path.join(__dirname, 'input1.txt');

function processLines(inputLines) {
  const list = [];
  inputLines.forEach(line => {
    const _list = line.split("").filter(_ => _);
    list.push(_list);
  });

  return list;
}

function inBounds(x, y, map) {
  return x >= 0 && x < map.length && y >= 0 && y < map[0].length;
}

// to resolve x1, y1 and x2, y2 to a normalized key
function normalizeKey(x1, y1, x2, y2) {
  if (x1 < x2) {
    return `${x1},${y1},${x2},${y2}`;
  } else if (x1 > x2) {
    return `${x2},${y2},${x1},${y1}`;
  } else if (y1 < y2) {
    return `${x1},${y1},${x2},${y2}`;
  } else {
    return `${x2},${y2},${x1},${y1}`;
  }
}

function calculateSides(_boundaries) {
  let sides = 0;
  let diagonalMatch = new Set();

  // for each entry having more than 1 in value, add 1 to sides
  _boundaries.forEach((value, key) => {
    if (value > 1) {
      sides++;
      console.log(key)
      _boundaries.set(key, value - 1);
    }
  });
  // console.log("<> ", _boundaries);
  // for each entry, see if any of the four diangonal entry is also present
  // if yes, add 1 to sides
  // also delete the key which is being matched
  const keys = Array.from(_boundaries.keys());
  for (let i = 0; i < keys.length; i++) {
    if (_boundaries.get(keys[i]) === 0) {
      continue;
    }
    const [x, y] = keys[i].split(",").map(_ => parseInt(_));
    const dx = [1, 1, -1, -1];
    const dy = [1, -1, 1, -1];

    for (let j = 0; j < 4; j++) {
      const nx = x + dx[j];
      const ny = y + dy[j];
      const key = `${nx},${ny}`;
      if (_boundaries.has(key) && !diagonalMatch.has(normalizeKey(x,y,nx,ny))) {
        sides++;
        console.log("Match: ", x, y, nx, ny);
        diagonalMatch.add(normalizeKey(x,y,nx,ny));
        _boundaries.set(`${x},${y}`, _boundaries.get(`${x},${y}`) - 1);
        break;
      }
    }
  }

  return sides;
}

function dfs(x, y, map, visited) {
  const dx = [0, 0, 1, -1];
  const dy = [1, -1, 0, 0];

  const type = map[x][y];
  const stack = [[x, y]];
  visited.add(`${x},${y}`);

  let area = 0, perimeter = 0;
  const _boundaries = new Map();

  while (stack.length) {
    const [_x, _y] = stack.pop();
    area++;

    for (let i = 0; i < 4; i++) {
      const nx = _x + dx[i];
      const ny = _y + dy[i];

      if (!inBounds(nx, ny, map) || map[nx][ny] !== type) {
        perimeter++;
        if (_boundaries.has(`${nx},${ny}`)) {
          _boundaries.set(`${nx},${ny}`, _boundaries.get(`${nx},${ny}`) + 1);
        } else {
          _boundaries.set(`${nx},${ny}`, 1);
        }
      } else if (!visited.has(`${nx},${ny}`)) {
        visited.add(`${nx},${ny}`);
        stack.push([nx, ny]);
      }
    }
  }

  // console.log(type, cornerPoints);
  // sort _boundaries by x, y
  // console.log(type, _boundaries);
  const sides = calculateSides(_boundaries);
  console.log(type, area, perimeter, sides);
  return {
    area,
    perimeter,
    sides,
  };
}

function calculateFencePrice(map) {
  const m = map.length;
  const n = map[0].length;
  const visited = new Set();

  let totalPrice1 = 0, totalPrice2 = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const key = `${i},${j}`;
      if (!visited.has(key)) {
        const { area, perimeter, sides } = dfs(i, j, map, visited);
        totalPrice1 += area * perimeter;
        totalPrice2 += area * sides;
      }
    }
  }

  return [totalPrice1, totalPrice2];
}

function main() {
  const inputLines = readInputFile(inputFilePath);
  const map = processLines(inputLines);

  const [price1, price2] = calculateFencePrice(map);
  console.log(price1);
  console.log(price2);
}

main();
