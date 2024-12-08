const path = require('path');
const { readInputFile } = require('../lib/read-file');

const inputFilePath = path.join(__dirname, 'input2.txt');

function processLines(inputLines) {
  const list = [];
  inputLines.forEach(line => {
    const _list = line.split("").filter(_ => _);
    list.push(_list);
  });

  return list;
}

function isAlphaNumeric(str) {
  return /^[a-z0-9]+$/i.test(str);
}

function inBounds(map, x, y) {
  return x >= 0 && x < map.length && y >= 0 && y < map[0].length;
}

function countAntinodes(map) {
  const antiNodes = new Set();
  const nodesMap = new Map();

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (isAlphaNumeric(map[i][j])) {
        if(nodesMap.has(map[i][j])) {
          const nodes = nodesMap.get(map[i][j]);
          for (const node of nodes) {
            const [x, y] = node;
            const [dx, dy] = [x - i, y - j];

            const [px, py] = [x + dx, y + dy];
            if(inBounds(map, px, py)) {
              antiNodes.add(`${px},${py}`);
            }

            const [qx, qy] = [i - dx, j - dy];
            if(inBounds(map, qx, qy)) {
              antiNodes.add(`${qx},${qy}`);
            }
          }
          nodesMap.get(map[i][j]).push([i, j]);
        } else {
          nodesMap.set(map[i][j], [[i, j]]);
        }
      }
    }
  }

  return antiNodes.size;
}

function countAntinodesWithResonantHarmonics(map) {
  const antiNodes = new Set();
  const nodesMap = new Map();

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (isAlphaNumeric(map[i][j])) {
        if(nodesMap.has(map[i][j])) {
          const nodes = nodesMap.get(map[i][j]);
          for (const node of nodes) {
            const [x, y] = node;
            const [dx, dy] = [x - i, y - j];

            let [px, py] = [i, j];
            let idx = 1;
            while (inBounds(map, px, py)) {
              antiNodes.add(`${px},${py}`);
              [px, py] = [x + idx * dx, y + idx * dy];
              idx++;
            }

            let [qx, qy] = node;
            idx = 1;
            while (inBounds(map, qx, qy)) {
              antiNodes.add(`${qx},${qy}`);
              [qx, qy] = [i - idx * dx, j - idx * dy];
              idx++;
            }
          }
          nodesMap.get(map[i][j]).push([i, j]);
        } else {
          nodesMap.set(map[i][j], [[i, j]]);
        }
      }
    }
  }

  return antiNodes.size;
}

function main() {
  const inputLines = readInputFile(inputFilePath);
  const originalMap = processLines(inputLines);

  console.log(countAntinodes(originalMap));
  console.log(countAntinodesWithResonantHarmonics(originalMap));
}

main();
