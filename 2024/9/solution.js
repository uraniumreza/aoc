const path = require('path');
const { readInputFile } = require('../lib/read-file');

const inputFilePath = path.join(__dirname, 'input2.txt');

function processLines(inputLines) {
  const line = inputLines[0].trim();
  return line;
}

function createDiskMap(line) {
  const blockMap = new Map();
  let diskMap = [];
  let id = 0;
  for (let index = 0; index < line.length; index++) {
    const element = parseInt(line[index]);

    if (index % 2 === 0) {
      blockMap.set(id, [diskMap.length, element]);

      for (let i = 0; i < element; i++) {
        diskMap.push(id);
      }
      id++;
    } else {
      for (let i = 0; i < element; i++) {
        diskMap.push('.');
      }
    }
  }

  return [diskMap, blockMap];
}

function moveFileBlocksOneByOne(diskMap) {
  let freeIndex = diskMap.indexOf('.');
  if (freeIndex === -1) {
    return diskMap;
  }

  for (let i = diskMap.length - 1; i > freeIndex; i--) {
    if (diskMap[i] !== '.') {
      diskMap[freeIndex] = diskMap[i];
      diskMap[i] = '.';

      do {
        freeIndex++;
      } while (freeIndex < diskMap.length && diskMap[freeIndex] !== '.');

      if (freeIndex >= i) {
        break;
      }
    }
  }

  return diskMap;
}

function moveFileBlocksByBlock(diskMap, blockMap) {
  diskMap = [...diskMap];
  const files = Array.from(blockMap.keys()).sort((a, b) => b - a);

  for (const fileId of files) {
    const [start, size] = blockMap.get(fileId);

    let bestPos = -1;
    let currentStart = -1;
    let currentLength = 0;

    for (let i = 0; i < start; i++) {
      if (diskMap[i] === '.') {
        if (currentStart === -1) currentStart = i;
        currentLength++;
        if (currentLength >= size) {
          bestPos = currentStart;
          break;
        }
      } else {
        currentStart = -1;
        currentLength = 0;
      }
    }

    if (bestPos !== -1) {
      for (let i = start; i < start + size; i++) {
        diskMap[i] = '.';
      }

      for (let i = bestPos; i < bestPos + size; i++) {
        diskMap[i] = fileId;
      }
    }
  }

  return diskMap;
}

function calculateChecksum(diskMap) {
  let checksum = 0;
  for (let index = 0; index < diskMap.length; index++) {
    const element = diskMap[index];
    if (element !== '.') {
      checksum += index * element;
    }
  }
  return checksum;
}

function main() {
  const inputLines = readInputFile(inputFilePath);
  const line = processLines(inputLines);
  const [diskMap, blockMap] = createDiskMap(line);
  const compactDiskMap1 = moveFileBlocksOneByOne(diskMap);
  const compactDiskMap2 = moveFileBlocksByBlock(diskMap, blockMap);
  const checksum1 = calculateChecksum(compactDiskMap1);
  const checksum2 = calculateChecksum(compactDiskMap2);
  console.log("CHECKSUM 1:", checksum1);
  console.log("CHECKSUM 2:", checksum2);
}

main();