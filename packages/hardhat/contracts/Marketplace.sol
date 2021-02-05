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

    event OfferAdded(string seller, string product, uint64 price);
    event AccountCredited(string owner, uint64 value);
    event FundsInEscrow(
        string buyer,
        string seller,
        uint64 amount,
        string product
    );
    event ProductOrdered(
        string buyer,
        string product,
        string seller,
        uint64 price
    );
    event OrderCompleted(string buyer, string product, string seller);

    function addCredit(string memory owner, uint64 value) public {
        accounts[owner] += value;

        emit AccountCredited(owner, value);
    }

    function addOffer(
        string memory seller,
        string memory product,
        uint64 price
    ) public {
        Offer[] storage offersForProduct = offers[product];
        offersForProduct.push(Offer(seller, product, price));

        emit OfferAdded(seller, product, price);
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

            string memory seller = offer.seller;
            uint64 price = offer.price;
            emit ProductOrdered(buyer, product, seller, price);
        }
    }

    function completeOrder(string memory buyer, string memory product) public {
        Offer storage offer = escrow[buyer][product];
        accounts[offer.seller] += offer.price;
        delete escrow[buyer][product];
    }

    function complainOrder(string memory buyer, string memory product) public {
        Offer storage offer = escrow[buyer][product];
        accounts[buyer] += offer.price;
        delete escrow[buyer][product];
    }

    function getCredit(string memory owner) public view returns (uint64) {
        return accounts[owner];
    }
}
