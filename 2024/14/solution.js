const path = require('path');
const { readInputFile } = require('../lib/read-file');

const inputFilePath = path.join(__dirname, 'input2.txt');

function processLines(inputLines) {
  const list = [];
  inputLines.forEach(line => {
    const [p, v] = line.split(" ").filter(_ => _);
    const [py, px] = p.split("=")[1].split(",").map(Number);
    const [vy, vx] = v.split("=")[1].split(",").map(Number);

    list.push({
      p: { x: parseInt(px), y: parseInt(py) },
      v: { x: parseInt(vx), y: parseInt(vy) }
    });
  });

  return list;
}

function getFinalLocation(item, r, c, time) {
  let x = (item.p.x + time * item.v.x) % r;
  let y = (item.p.y + time * item.v.y) % c;

  // handle negative values
  x = x < 0 ? x + r : x;
  y = y < 0 ? y + c : y;

  return [x, y];
}

function calculateSafetyFactor(listOfItems) {
  const r = 103, c = 101;
  const map = new Map();
  for (item of listOfItems) {
    const [x, y] = getFinalLocation(item, r, c, 100);
    map.set(`${x},${y}`, (map.get(`${x},${y}`) || 0) + 1);
  }

  console.log(map);

  // calculate the individual total count of each quadrant of 11 x 7 grid
  // and then multiple 4 of them to get the safety factor
  let safetyFactor = 1;
  const quadrants = [
    [0, Math.floor(r / 2), 0, Math.floor(c / 2)],
    [0, Math.floor(r / 2), Math.ceil(c / 2), c],
    [Math.ceil(r / 2), r, 0, Math.floor(c / 2)],
    [Math.ceil(r / 2), r, Math.ceil(c / 2), c]
  ];

  for (const [x1, x2, y1, y2] of quadrants) {
    let count = 0;
    console.log(x1, x2, y1, y2);
    for (let x = x1; x < x2; x++) {
      for (let y = y1; y < y2; y++) {
        console.log(`${x},${y}`, map.get(`${x},${y}`));
        count += map.get(`${x},${y}`) || 0;
      }
    }
    console.log(count);
    safetyFactor *= count;
  }

  return safetyFactor;
}

function main() {
  const inputLines = readInputFile(inputFilePath);
  const listOfItems = processLines(inputLines);

  console.log(calculateSafetyFactor(listOfItems));
}

main();
