// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.1;

struct Offer {
  address seller;
  string product;
  uint256 priceInWei;
  address buyer;
}

interface IOffers {
  event OfferAdded(uint256 indexed id, Offer offer);

  function getOffer(uint256 id) external view returns (Offer memory offer);

  function addOffer(string memory product, uint256 priceInWei)
    external
    returns (uint256 offerId);

  function setBuyerForOffer(uint256 offerId, address buyer) external;
}
