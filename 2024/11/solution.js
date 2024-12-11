const path = require('path');
const { readInputFile } = require('../lib/read-file');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

let inputFilePath = path.join(__dirname, 'input2.txt');

function processLines(inputLine) {
  console.log(inputLine);
  const _list = inputLine[0].split(" ").filter(_ => _);
  const bigNumberList = _list.map(item => BigInt(item));

  return bigNumberList;
}

function blink(numbers, times) {
  for (let i = 0; i < times; i++) {
    const newNumbers = [];
    for (let j = 0; j < numbers.length; j++) {
      const number = numbers[j];
      const numberString = number.toString();
      if (number === 0n) {
        newNumbers.push(1n);
      } else if (numberString.length % 2 === 0) {
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
  return numbers;
}

function runBlinkWorker(numbers, times) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(__filename, {
      workerData: { numbers, times }
    });

    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', code => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

async function parallelBlink(numbers, times, numWorkers) {
  const chunkSize = Math.ceil(numbers.length / numWorkers);
  const promises = [];

  for (let i = 0; i < numWorkers; i++) {
    const chunk = numbers.slice(i * chunkSize, (i + 1) * chunkSize);
    promises.push(runBlinkWorker(chunk, times));
  }

  const results = await Promise.all(promises);
  return results.reduce((acc, val) => acc.concat(val), []);
}

async function parallelBlinkWithTimes(numbers, totalTimes, numWorkers) {
  let currentNumbers = numbers;

  for (let i = 0; i < totalTimes; i++) {
    currentNumbers = await parallelBlink(currentNumbers, 1, numWorkers);
  }

  return currentNumbers;
}

if (isMainThread) {
  async function main() {
    const inputLines = readInputFile(inputFilePath);
    const numbers = processLines(inputLines);
    console.log(numbers);

    const numWorkers = 4; // Adjust based on your system's capabilities
    let result = await parallelBlinkWithTimes(numbers, 25, numWorkers);
    console.log(result.length);

    // Time start and end to calculate the time taken
    const start = new Date();
    result = await parallelBlinkWithTimes(numbers, 75, numWorkers);
    const end = new Date();
    console.log((end - start) / 1000 + " seconds");
    console.log(result.length);
  }

  main().catch(err => console.error(err));
} else {
  const { numbers, times } = workerData;
  const result = blink(numbers, times);
  parentPort.postMessage(result);
}