const fs = require('fs');

function readInputFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n').map(line => line.trim());
    return lines;
  } catch (err) {
    console.error('Error reading the file:', err);
    return [];
  }
}

module.exports = { readInputFile };
