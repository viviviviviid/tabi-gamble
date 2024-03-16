// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract TabiGamble {
    event NewGamble(address gambler, uint256 amount);
    event GambleResult(address gambler, bool result);
    event NewRandomNumber(uint256 randNum);

    uint256 _maxStake = 1e17; // 0.1 ETH
    uint256 _nonce = 0;
    address public owner;

    // 생성자를 사용하여 소유자 주소 초기화
    constructor() {
        owner = 0xc3556BA1e56F9FD263fF8196B3B783BD14D90AD8;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    function _generateRandNum() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, _nonce))) % 100;
    }

    function CheckResult() private returns (bool) {
        uint256 randNum = _generateRandNum();
        bool result = randNum % 2 == 0;
        emit GambleResult(msg.sender, result);
        return result;
    }

    function SendAll() public payable onlyOwner {
        (bool sent, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }

    function Deposit() public payable onlyOwner {
    }

    function GambleStart() public payable {
        require(msg.value <= _maxStake, "Gamble amount must be lower than 0.1 ETH");
        require(msg.value <= address(this).balance, "Contract wallet doesn't have enough balance");
        emit NewGamble(msg.sender, msg.value);

        if (CheckResult()) {
            uint256 prize = 3 * msg.value; // 이미 1만큼 들어왔으니 2배 이득을 주려면, 총 3배를 줘야 함
            (bool sent, ) = payable(msg.sender).call{value: prize}("");
            require(sent, "Failed to send Ether");
        }
    }
}
