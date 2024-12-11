const path = require('path');
const { readInputFile } = require('../lib/read-file');

let inputFilePath = path.join(__dirname, 'input2.txt');

function processLines(inputLine) {
  const _list = inputLine[0].split(" ").filter(_ => _);
  const bigNumberList = _list.map(item => BigInt(item));
  return bigNumberList;
}

function isEvenLength(number) {
  const length = number.toString().length;
  return length % 2 === 0;
}

function blink(numbers, times) {
  for (let i = 0; i < times; i++) {
    const newNumbers = [];
    for (let j = 0; j < numbers.length; j++) {
      const number = numbers[j];
      const numberString = number.toString();
      if (number === 0n) {
        newNumbers.push(1n);
      } else if (isEvenLength(number)) {
        const half = numberString.length / 2;
        const left = numberString.slice(0, half);
        const right = numberString.slice(half);

        newNumbers.push(BigInt(left));
        newNumbers.push(BigInt(right));
      } else {
        newNumbers.push(number * 2024n);
      }
    }
    numbers = newNumbers;
  }
  return numbers.length;
}

function blinkOptimized(numbers, times) {
  let counts = new Map();

  for (const number of numbers) {
    const key = number.toString();
    counts.set(key, (counts.get(key) || 0n) + 1n);
  }

  for (let i = 0; i < times; i++) {
    const newCounts = new Map();

    for (const [numStr, count] of counts) {
      const number = BigInt(numStr);

      if (number === 0n) {
        const key = '1';
        newCounts.set(key, (newCounts.get(key) || 0n) + count);
      } else if (isEvenLength(number)) {
        const numString = numStr;
        const half = numString.length / 2;
        const left = BigInt(numString.slice(0, half));
        const right = BigInt(numString.slice(half));

        const leftKey = left.toString();
        const rightKey = right.toString();

        newCounts.set(leftKey, (newCounts.get(leftKey) || 0n) + count);
        newCounts.set(rightKey, (newCounts.get(rightKey) || 0n) + count);
      } else {
        const newNumber = number * 2024n;
        const key = newNumber.toString();
        newCounts.set(key, (newCounts.get(key) || 0n) + count);
      }
    }

    counts = newCounts;
  }

  let totalCount = 0n;
  for (const count of counts.values()) {
    totalCount += count;
  }

  return totalCount;
}

function main() {
  const inputLines = readInputFile(inputFilePath);
  const numbers = processLines(inputLines);

  console.log("Part 1: (Brute force) ");
  const result1 = blink(numbers, 25);
  console.log(result1.toString());

  console.log("\nPart 2:");
  const start = Date.now();
  const result2 = blinkOptimized(numbers, 75);
  console.log(`Time: ${(Date.now() - start) / 1000}s`);
  console.log(result2.toString());
}

main();