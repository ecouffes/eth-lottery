const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');
const { interface, bytecode } = require('./compile');

const mnemonic = process.env.MNEMONIC;
const accessToken = process.env.INFURA_ACCESS_TOKEN;
const provider = new HDWalletProvider(
  mnemonic,
  "https://rinkeby.infura.io/" + accessToken
);
const web3 = new Web3(provider);


(async () => {
  const accounts = await web3.eth.getAccounts();
  const deployer = accounts[0];

  console.log('Attempting to deploy from account', deployer);

  const instance = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: '0x' + bytecode
    })
    .send({
      from: deployer,
      // gas: '1000000'
    });

  console.log('Contract ABI is', interface);
  console.log('Contract deployed to', instance.options.address);
})();


// run with "node deploy"