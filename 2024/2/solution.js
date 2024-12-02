const path = require('path');
const { readInputFile } = require('../lib/read-file');

const inputFilePath = path.join(__dirname, 'input2.txt');

function processLines(inputLines) {
  const list = [];
  inputLines.forEach(line => {
    const _list = line.split(" ").filter(_ => _).map(_ => parseInt(_, 10));
    list.push(_list);
  });

  return list;
}

function isStrictlyIncreasing(list) {
  for (let i = 0; i < list.length - 1; i++) {
    if (list[i] >= list[i + 1]) {
      return false;
    } else if (list[i + 1] - list[i] > 3) {
      return false;
    }
  }

  return true;
}

function isStrictlyDecreasing(list) {
  for (let i = 0; i < list.length - 1; i++) {
    if (list[i] <= list[i + 1]) {
      return false;
    } else if (list[i] - list[i + 1] > 3) {
      return false;
    }
  }

  return true;
}

function getSafeCount(reports) {
  let count = 0;

  reports.forEach(report => {
    if (isStrictlyIncreasing(report)) {
      count++;
    } else if (isStrictlyDecreasing(report)) {
      count++;
    }
  })

  return count;
}

function getSafeCountWithDamper(reports) {
  let count = 0;

  reports.forEach(report => {
    for (let i = 0; i < report.length; i++) {
      const _report = report.slice();
      _report.splice(i, 1);

      if (isStrictlyIncreasing(_report)) {
        count++;
        break;
      } else if (isStrictlyDecreasing(_report)) {
        count++;
        break;
      }
    }
  })

  return count;
}

function main() {
  const inputLines = readInputFile(inputFilePath);
  const listOfItems = processLines(inputLines);

  let safeCount = getSafeCount(listOfItems);
  console.log("Safe Count: ", safeCount);

  safeCount = getSafeCountWithDamper(listOfItems);
  console.log("Safe Count with Damper: ", safeCount);
}

main();
