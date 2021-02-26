// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.1;

import 'hardhat/console.sol';
import './Credit.sol';
import './IOffers.sol';

contract Order is Credit {
  mapping(address => mapping(uint256 => Offer)) public escrow;

  IOffers immutable _offersContract;

  constructor(address offersContractAddress) {
    _offersContract = IOffers(offersContractAddress);
  }

  function orderProduct(uint256 offerId) external {
    address buyer = msg.sender;
    Offer memory offer = _offersContract.getOffer(offerId);

    if (offer.seller != address(0x00)) {
      console.log('orderProduct', buyer, offer.product);
      console.log('buyer credits before:', credits[buyer]);

      require(
        credits[buyer] >= offer.priceInWei,
        'Buyer does not have enough credits'
      );
      require(offer.buyer == address(0x00), 'Offer is not available');

      console.log('Escrow for', offer.product, 'value:', offer.priceInWei);
      credits[buyer] -= offer.priceInWei;
      escrow[buyer][offerId] = offer;
      _offersContract.setBuyerForOffer(offerId, buyer);

      emit Escrow(
        buyer,
        offer.seller,
        offerId,
        offer.priceInWei,
        offer.product,
        'ORDER'
      );

      console.log('buyer credits after:', credits[buyer]);
    }
  }

  function completeOrder(uint256 offerId) external {
    address buyer = msg.sender;
    Offer memory offer = escrow[buyer][offerId];

    if (offer.seller != address(0x00)) {
      console.log('Seller credits before:', credits[offer.seller]);
      console.log('Move credits to:', offer.seller, 'value:', offer.priceInWei);
      credits[offer.seller] += offer.priceInWei;

      delete escrow[buyer][offerId];

      _offersContract.setOfferState(offerId, OfferState.Completed);
      emit Escrow(
        buyer,
        offer.seller,
        offerId,
        offer.priceInWei,
        offer.product,
        'COMPLETED'
      );
      console.log('Seller credits after:', credits[offer.seller]);
    }
  }

  function complainOrder(uint256 offerId) external {
    address buyer = msg.sender;
    Offer memory offer = escrow[buyer][offerId];

    if (offer.seller != address(0x00)) {
      console.log('Buyer credits before:', credits[buyer]);
      console.log('Move credits to:', buyer, 'value:', offer.priceInWei);
      credits[buyer] += offer.priceInWei;

      delete escrow[buyer][offerId];

      _offersContract.setOfferState(offerId, OfferState.Complaint);

      emit Escrow(
        buyer,
        offer.seller,
        offerId,
        offer.priceInWei,
        offer.product,
        'COMPLAIN'
      );
      console.log('Buyer credits after:', credits[buyer]);
    }
  }

  function getEscrow(address buyer, uint256 offerId)
    external
    view
    returns (Offer memory offer)
  {
    offer = escrow[buyer][offerId];
  }

  event Escrow(
    address indexed buyer,
    address indexed seller,
    uint256 offerId,
    uint256 value,
    string product,
    string eventType
  );
}
