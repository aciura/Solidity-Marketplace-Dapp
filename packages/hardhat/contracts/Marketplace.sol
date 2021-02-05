// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.8.0;

import "hardhat/console.sol";

struct Offer {
    string seller;
    string product;
    //decimals=2, price range = [0..2**62 - 1]
    uint64 price;
}

contract Marketplace {
    mapping(string => uint64) public accounts;
    mapping(string => Offer[]) public offers;
    mapping(string => mapping(string => Offer)) public escrow;

    event Escrow(
        string buyer,
        string seller,
        uint64 value,
        string product,
        string eventType
    );

    function addCredit(string memory owner, uint64 value) public {
        accounts[owner] += value;
    }

    function addOffer(
        string memory seller,
        string memory product,
        uint64 price
    ) public {
        Offer[] storage offersForProduct = offers[product];
        offersForProduct.push(Offer(seller, product, price));
    }

    function orderProduct(string memory buyer, string memory product) public {
        // maybe it should be memory?
        Offer[] storage offersForProduct = offers[product];
        console.log("orderProduct", buyer, product, offersForProduct.length);

        if (offersForProduct.length > 0) {
            Offer memory offer = offersForProduct[0];
            require(
                accounts[buyer] >= offer.price,
                "Buyer does not have enough credits"
            );

            accounts[buyer] -= offer.price;
            escrow[buyer][product] = offer;

            emit Escrow(buyer, offer.seller, offer.price, product, "ORDER");
        }
    }

    function completeOrder(string memory buyer, string memory product) public {
        Offer memory offer = escrow[buyer][product];
        accounts[offer.seller] += offer.price;
        delete escrow[buyer][product];

        emit Escrow(buyer, offer.seller, offer.price, product, "COMPLETED");
    }

    function complainOrder(string memory buyer, string memory product) public {
        Offer memory offer = escrow[buyer][product];
        accounts[buyer] += offer.price;
        delete escrow[buyer][product];

        emit Escrow(buyer, offer.seller, offer.price, product, "COMPLAIN");
    }

    function getCredit(string memory owner) public view returns (uint64) {
        return accounts[owner];
    }
}
