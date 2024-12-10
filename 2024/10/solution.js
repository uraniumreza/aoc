const path = require('path');
const { readInputFile } = require('../lib/read-file');

const inputFilePath = path.join(__dirname, 'input2.txt');

function processLines(inputLines) {
  const list = [];
  inputLines.forEach(line => {
    const _list = line.split("").map(Number);
    list.push(_list);
  });

  return list;
}

function inBounds(map, x, y) {
  return x >= 0 && x < map.length && y >= 0 && y < map[0].length;
}

function searchUniquePath(map, i, j) {
  const m = map.length;
  const n = map[0].length;

  const visitedDestinations = new Set();

  const queue = [];
  queue.push([i, j]);

  const visited = new Set();
  visited.add(`${i},${j}`);

  while (queue.length > 0) {
    const [x, y] = queue.shift();

    if (map[x][y] === 9) {
      const key = `${x},${y}`;
      if (!visitedDestinations.has(key)) {
        visitedDestinations.add(key);
      }
    }

     const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1]
    ];

    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;
      const key = `${newX},${newY}`;

      if (
        inBounds(map, newX, newY) &&
        !visited.has(key) &&
        map[newX][newY] === map[x][y] + 1
      ) {
        queue.push([newX, newY]);
        visited.add(key);
      }
    }
  }

  return visitedDestinations.size;
}


function calculateTotalScore(map) {
  let totalScore = 0;

  const m = map.length;
  const n = map[0].length;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (map[i][j] === 0) {
        const score = searchUniquePath(map, i, j);
        totalScore += score;
      }
    }
  }

  return totalScore;
}

function searchAllPaths(map, i, j) {
  const m = map.length;
  const n = map[0].length;

  let score = 0;

  const queue = [];
  queue.push([i, j]);
  while (queue.length > 0) {
    const [x, y] = queue.shift();

    if (map[x][y] === 9) {
      score++;
    }

     const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1]
    ];

    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;
      const key = `${newX},${newY}`;

      if (
        inBounds(map, newX, newY) &&
        map[newX][newY] === map[x][y] + 1
      ) {
        queue.push([newX, newY]);
      }
    }
  }

  return score;
}


function calculateTotalScoreWithRating(map) {
  let totalScore = 0;

  const m = map.length;
  const n = map[0].length;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (map[i][j] === 0) {
        const score = searchAllPaths(map, i, j);
        totalScore += score;
      }
    }
  }

  return totalScore;
}

function main() {
  const inputLines = readInputFile(inputFilePath);
  const map = processLines(inputLines);

  const score1 = calculateTotalScore(map);
  console.log("SCORE 1: ", score1);
  const score2 = calculateTotalScoreWithRating(map);
  console.log("SCORE 2: ", score2);
}

main();
