const path = require('path'); // cross platform path compile building
const fs = require('fs');
const solc = require('solc');

const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
const source = fs.readFileSync(lotteryPath, 'utf8');

// Setting 1 as second paramateractivates the optimiser
console.log(solc.compile(source, 1)); // run with "node compile"
module.exports = solc.compile(source, 1).contracts[':Lottery'];