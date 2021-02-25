// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.1;

import '@openzeppelin/contracts/access/Ownable.sol';
import 'hardhat/console.sol';

import './IOffers.sol';

contract Offers is IOffers, Ownable {
  mapping(uint256 => Offer) public _offers;
  address private _orderContractAddress;
  uint256[] public _allOfferIds;

  function setOrderContractAddress(address orderContract) public onlyOwner {
    console.log('Setting orderContract', orderContract);
    _orderContractAddress = orderContract;
  }

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

    Offer memory offer = Offer(msg.sender, product, priceInWei, address(0x00));
    _offers[id] = offer;
    _allOfferIds.push(offerId);

    emit OfferAdded(id, offer);
    return id;
  }

  function setBuyerForOffer(uint256 offerId, address buyer) external override {
    console.log('msg.sender=', msg.sender);
    console.log('orderContract:', _orderContractAddress);
    require(
      msg.sender == _orderContractAddress,
      'Can be only called by OrderContract'
    );

    Offer storage offer = _offers[offerId];
    if (offer.seller != address(0x00)) {
      offer.buyer = buyer;
      console.log('Assigned buyer to offer of:', offer.product);
    }
  }

  function getOffer(uint256 id)
    external
    view
    override
    returns (Offer memory offer)
  {
    return _offers[id];
  }

  function allOffersLength() external view returns (uint256) {
    return _allOfferIds.length;
  }

  function getAllOffers() external view returns (uint256[] memory) {
    return _allOfferIds;
  }
}
