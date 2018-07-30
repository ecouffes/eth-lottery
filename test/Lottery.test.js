const assert = require('assert'); //node.js core module
const ganache = require('ganache-cli');
const Web3 = require('web3');
const { interface, bytecode } = require('../compile');

const provider = ganache.provider();
const web3 = new Web3(provider);

let accounts;
let lottery;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: '0x' + bytecode
    })
    .send({
      from: accounts[0],
      gas: '1000000'
    });

  lottery.setProvider(provider);
});

// npm run test
describe('Lottery Contract', () => {
  it('deploys a contract', () => {
    // "assert.ok" is a alias of "assert"
    assert.ok(lottery.options.address);
  });

  it('allows one account to enter', async () => {
    // web3.eth.Contract.methods,myMethods.send()
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.01', 'ether')
    });

    // web3.eth.Contract.methods,myMethods.call()
    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });

    assert.equal(players[0], accounts[0]);
    assert.equal(players.length, 1);
  });


  it('allows multiple accounts to enter', async () => {
    // web3.eth.Contract.methods,myMethods.send()
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.01', 'ether')
    });
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.01', 'ether')
    });
    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei('0.01', 'ether')
    });

    // web3.eth.Contract.methods,myMethods.call()
    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });

    assert.equal(players[0], accounts[0]);
    assert.equal(players[1], accounts[1]);
    assert.equal(players[2], accounts[2]);
    assert.equal(players.length, 3);
  });

  it('requires a minimum amount of ether to enter', async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: 0
      });
      // errを返さない場合は、AssertionErrorを出す
      assert.ok(false);
    } catch (err) {
      console.log(err.message);
    }
  });

  it('only manager can call pickWinner function', async () => {
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[1]
      });
      assert.ok(false);
    } catch (err) {
      console.log(err.message);
    }
  });

  it('sends money to the winner and resets the players array', async () => {
    const lotteryBet = web3.utils.toWei('2', 'ether');
    await lottery.methods.enter().send({
      from: accounts[1],
      value: lotteryBet
    });
    const initialBalance = await web3.eth.getBalance(accounts[1]);

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });
    const finalBalance = await web3.eth.getBalance(accounts[1]);
    const diffBalance = finalBalance - initialBalance;

    assert.ok(lotteryBet, diffBalance);
  });

});