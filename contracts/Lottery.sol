pragma solidity ^0.4.22;

contract Lottery {

    // state variable (storage variable, instance variable)
    address public manager;
    address[] public players;

    constructor() public {
        manager = msg.sender;
    }

    // function modifier
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function enter() public payable {
        require(msg.value >= .01 ether);
        players.push(msg.sender);
    }

    // pseudo-random generator
    function random() private view returns (uint) {
        // keccak256(...) returns (bytes32)
        // alias of sha3(...)
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }

    function pickWinner() public restricted {
        // 乱数 % 数値 では、必ず数値の範囲内で乱数を返す
        uint index = random() % players.length;
        players[index].transfer(address(this).balance);

        // dynamic array init
        // new type[](initial size)
        players = new address[](0);
    }

    // getter of array state variable
    function getPlayers() public view returns (address[]) {
        return players;
    }
}