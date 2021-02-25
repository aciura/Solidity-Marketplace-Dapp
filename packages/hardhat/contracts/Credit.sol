// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.1;

import 'hardhat/console.sol';

contract Credit {
  bool private _reentrancyLock = false;
  mapping(address => uint256) public credits;

  function addCredit() external payable {
    require(msg.value > 0, 'No value sent');
    console.log('addCredit', msg.sender, msg.value);
    credits[msg.sender] += msg.value;
  }

  function getCredit(address addr) public view returns (uint256) {
    console.log('getCredit', addr);
    return credits[addr];
  }

  function withdrawCredit(uint256 value) external {
    require(credits[msg.sender] >= value, 'Not enough credits');
    require(!_reentrancyLock, 're-entrance');
    credits[msg.sender] -= value;

    _reentrancyLock = true;
    payable(msg.sender).transfer(value);
    _reentrancyLock = false;
  }
}
