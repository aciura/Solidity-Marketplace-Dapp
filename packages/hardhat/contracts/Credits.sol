// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.1;

import 'hardhat/console.sol';

contract Credits {
  bool private reentrancyLock = false;
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
    require(!reentrancyLock, 're-entrance');
    credits[msg.sender] -= value;

    reentrancyLock = true;
    payable(msg.sender).transfer(value);
    reentrancyLock = false;
  }
}
