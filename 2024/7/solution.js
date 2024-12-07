const path = require('path');
const { readInputFile } = require('../lib/read-file');

const inputFilePath = path.join(__dirname, 'input1.txt');

function processLines(inputLines) {
  const entries = [];
  inputLines.forEach(line => {
    const [testValueStr, numsStr] = line.split(":").filter(_ => _).map(_ => _.trim());
    const testValue = Number(testValueStr);
    const numbers = numsStr.split(" ").map(Number);
    entries.push({ testValue, numbers });
  });

  return entries;
}

function evaluateExpression(numbers, operations) {
  let result = numbers[0];

  for (let i = 0; i < operations.length; i++) {
    if (operations[i] === '+') {
      result += numbers[i + 1];
    } else if (operations[i] === '*') {
      result *= numbers[i + 1];
    } else if (operations[i] === '|') {
      result = Number(`${result}${numbers[i + 1]}`);
    }
  }

  return result;
}

function generateOperatorCombinations(count, operators) {
  const combinations = [];

  function helper(current) {
    if (current.length === count) {
      combinations.push(current);
      return;
    }
    for (const operator of operators) {
      helper(current + operator);
    }
  }

  helper('');
  return combinations;
}

function calculateTotalCalibrationResult(entries, operators) {
  let totalCalibrationResult = 0;

  for (const entry of entries) {
    const { testValue, numbers } = entry;

    const operatorCombinations = generateOperatorCombinations(numbers.length - 1, operators);

    let isSolvable = false;
    for (const combination of operatorCombinations) {
      const operations = combination.split('');
      if (evaluateExpression(numbers, operations) === testValue) {
        isSolvable = true;
        break;
      }
    }

    if (isSolvable) {
      totalCalibrationResult += testValue;
    }
  }

  return totalCalibrationResult;
}

function main() {
  const inputLines = readInputFile(inputFilePath);
  const listOfEntries = processLines(inputLines);

  let operators = ['+', '*'];
  let totalCalibrationResult = calculateTotalCalibrationResult(listOfEntries, operators);
  console.log("RESULT 2: ", totalCalibrationResult);

  operators = ['+', '*', '|'];
  totalCalibrationResult = calculateTotalCalibrationResult(listOfEntries, operators);
  console.log("RESULT 2: ", totalCalibrationResult);
}

main();
