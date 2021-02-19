// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.1;

import 'hardhat/console.sol';
import './IOffers.sol';

contract Offers is IOffers {
  mapping(uint256 => Offer) public offers;

  function addOffer(string memory product, uint256 priceInWei)
    external
    override
    returns (uint256 offerId)
  {
    uint256 id =
      uint256(
        keccak256(abi.encodePacked(block.timestamp, msg.sender, product))
      );
    console.log('addOffer', msg.sender, product, priceInWei);

    Offer memory offer = Offer(msg.sender, product, priceInWei);
    offers[id] = offer;

    emit OfferAdded(id, offer);
    return id;
  }

  function getOffer(uint256 id)
    external
    view
    override
    returns (Offer memory offer)
  {
    return offers[id];
  }
}
