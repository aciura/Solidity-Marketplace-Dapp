// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.8.0;

import "hardhat/console.sol";

struct Offer {
    string seller;
    string product;
    //decimals=2, price range = [0..2**62 - 1]
    uint256 price;
    uint256 quantity;
}

contract Marketplace {
    mapping(string => uint256) public accounts;
    mapping(string => Offer[]) public offers;
    mapping(string => mapping(string => Offer)) public escrow;

    event Escrow(
        string buyer,
        string seller,
        uint256 value,
        string product,
        string eventType
    );

    function addCredit(string memory owner, uint256 value) public {
        accounts[owner] += value;
    }

    function addOffer(
        string memory seller,
        string memory product,
        uint256 price,
        uint256 quantity
    ) public {
        console.log(
            string(abi.encodePacked("addOffer: ", seller)),
            product,
            price,
            quantity
        );
        Offer[] storage offersForProduct = offers[product];
        offersForProduct.push(Offer(seller, product, price, quantity));
    }

    function orderProduct(string memory buyer, string memory product) public {
        Offer[] storage offersForProduct = offers[product];
        console.log("orderProduct", buyer, product, offersForProduct.length);

        if (offersForProduct.length > 0) {
            Offer storage offer = offersForProduct[0];
            require(
                accounts[buyer] >= offer.price,
                "Buyer does not have enough credits"
            );

            offer.quantity -= 1;
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

    function getCredit(string memory owner) public view returns (uint256) {
        return accounts[owner];
    }

    function getQuantity(string memory product) public view returns (uint256) {
        Offer[] memory offersForProduct = offers[product];
        if (offersForProduct.length > 0) {
            return offersForProduct[0].quantity;
        }
        return 0;
    }
}
