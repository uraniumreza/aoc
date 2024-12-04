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

function checkXMAS(listOfItems, i, j, word, index, direction) {
  const m = listOfItems.length;
  const n = listOfItems[0].length;

  const wordLength = word.length;

  if (index === wordLength) {
    return true;
  }

  if (i < 0 || i >= m || j < 0 || j >= n || listOfItems[i][j] !== word[index]) {
    return false;
  }

  let nextI = i, nextJ = j;

  switch (direction) {
    case 'top':
      nextI = i - 1;
      break;
    case 'bottom':
      nextI = i + 1;
      break;
    case 'left':
      nextJ = j - 1;
      break;
    case 'right':
      nextJ = j + 1;
      break;
    case 'topRight':
      nextI = i - 1;
      nextJ = j + 1;
      break;
    case 'topLeft':
      nextI = i - 1;
      nextJ = j - 1;
      break;
    case 'bottomRight':
      nextI = i + 1;
      nextJ = j + 1;
      break;
    case 'bottomLeft':
      nextI = i + 1;
      nextJ = j - 1;
      break;
  }

  return checkXMAS(listOfItems, nextI, nextJ, word, index + 1, direction);
}

function countXMAS(listOfItems, word) {
  const m = listOfItems.length;
  const n = listOfItems[0].length;
  let count = 0;

  const directions = ['top', 'bottom', 'left', 'right', 'topRight', 'topLeft', 'bottomRight', 'bottomLeft'];

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (listOfItems[i][j] === word[0]) {
        directions.forEach(direction => {
          if (checkXMAS(listOfItems, i, j, word, 0, direction)) {
            count++;
          }
        });
      }
    }
  }

  return count;
}

function countX_MAS(listOfItems, word) {
  const m = listOfItems.length;
  const n = listOfItems[0].length;
  let count = 0;

  const directions = ['topRight', 'topLeft', 'bottomRight', 'bottomLeft'];
  const setOfMas = new Set();
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (listOfItems[i][j] === word[0]) {
        directions.forEach(direction => {
          if (checkXMAS(listOfItems, i, j, word, 0, direction)) {
            if (direction === 'topRight' && (checkXMAS(listOfItems, i, j + 2, word, 0, 'topLeft') || checkXMAS(listOfItems, i - 2, j, word, 0, 'bottomRight'))) {
              setOfMas.add(`${i-1}, ${j+1}`);
            }
            if (direction === 'topLeft' && (checkXMAS(listOfItems, i, j - 2, word, 0, 'topRight') || checkXMAS(listOfItems, i - 2, j, word, 0, 'bottomLeft'))) {
              setOfMas.add(`${i-1}, ${j-1}`);
            }
            if (direction === 'bottomRight' && (checkXMAS(listOfItems, i, j + 2, word, 0, 'bottomLeft') || checkXMAS(listOfItems, i + 2, j, word, 0, 'topRight'))) {
              setOfMas.add(`${i+1}, ${j+1}`);
            }
            if (direction === 'bottomLeft' && (checkXMAS(listOfItems, i, j - 2, word, 0, 'bottomRight') || checkXMAS(listOfItems, i + 2, j, word, 0, 'topLeft'))) {
              setOfMas.add(`${i+1}, ${j-1}`);
            }
          }
        });
      }
    }
  }

  return setOfMas.size;
}

function main() {
  const inputLines = readInputFile(inputFilePath);
  const listOfItems = processLines(inputLines);

  const result1 = countXMAS(listOfItems, 'XMAS');
  const result2 = countX_MAS(listOfItems, 'MAS');

  console.log("Total XMAS found: ", result1);
  console.log("Total X_MAS found: ", result2);
}

main();