const path = require('path');
const { readInputFile } = require('../lib/read-file');

const inputFilePath = path.join(__dirname, 'input1.txt');

function processLines(inputLines) {
  const listA = [], listB = [];
  inputLines.forEach(line => {
    const [a, b] = line.split(" ").filter(_ => _);
    listA.push(a);
    listB.push(b);
  });

  return [listA, listB];
}

function totalDistanceBetweenLists(listA, listB) {
  listA.sort();
  listB.sort();

  let totalDistance = 0;
  for (let i = 0; i < listA.length; i++) {
    totalDistance += Math.abs(listA[i] - listB[i]);
  }

  return totalDistance;
}

function getSimilarityScore(listA, listB) {
  const listBCounter = new Map();
  listB.forEach(item => {
    listBCounter.set(item, (listBCounter.get(item) ?? 0) + 1);
  })

  const score = listA.reduce((acc, item) => {
    if (listBCounter.has(item)) {
      acc += (parseInt(item, 10) * listBCounter.get(item));
    }

    return acc;
  }, 0)

  return score;
}

function main() {
  const inputLines = readInputFile(inputFilePath);
  const [listA, listB] = processLines(inputLines);

  const totalDistance = totalDistanceBetweenLists(listA, listB);
  console.log("Total Distance: ", totalDistance);

  const similarityScore = getSimilarityScore(listA, listB);
  console.log("Similarity Score: ", similarityScore);
}

main();
