const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("Marketplace Dapp", async () => {
  let myContract;

  it("Should deploy the contract", async () => {
    const MarketplaceContract = await ethers.getContractFactory("Marketplace");
    myContract = await MarketplaceContract.deploy();
  });

  describe("Marketplace", () => {
    beforeEach(async () => {
      const MarketplaceContract = await ethers.getContractFactory(
        "Marketplace"
      );
      myContract = await MarketplaceContract.deploy();
    });

    it("Should add credit to account", async () => {
      const owner = "buyer";
      const value = 123;
      await myContract.addCredit(owner, value);

      const credit = await myContract.getCredit(owner);
      expect(credit).to.equal(value);
    });

    it("Should sum credit when executed twice", async () => {
      const owner = "buyer";
      const value = 123;
      const creditStart = await myContract.getCredit(owner);
      console.log("credit 1", creditStart.toString());

      await myContract.addCredit(owner, value);
      await myContract.addCredit(owner, value);

      const creditEnd = await myContract.getCredit(owner);
      console.log("credit 1", creditEnd.toString());
      expect(creditEnd - creditStart).to.equal(value * 2);
    });

    describe("Complete order", () => {
      it("Should create a new offer, order product and complete order", async () => {
        const seller = "seller";
        const buyer = "buyer";
        const buyerCredit = 1000;
        const product = "T-Shirt";
        const price = 123;
        const quantity = 10;

        await myContract.addCredit(buyer, buyerCredit);
        await myContract.addOffer(seller, product, price, quantity);
        await myContract.orderProduct(buyer, product);
        await myContract.completeOrder(buyer, product);

        expect(await myContract.getCredit(seller)).to.equal(price);
        expect(await myContract.getCredit(buyer)).to.equal(buyerCredit - price);
        expect(await myContract.getQuantity(product)).to.equal(quantity - 1);
      });

      it("Two sellers sell the same product, only the first seller should get money", async () => {
        const seller = "seller";
        const seller2 = "seller2";
        const buyer = "buyer";
        const buyerCredit = 1000;
        const product = "T-Shirt";
        const price = 123;
        const quantity = 10;

        await myContract.addCredit(buyer, buyerCredit);
        await myContract.addOffer(seller, product, price, quantity);
        await myContract.addOffer(seller2, product, 321, 1);
        await myContract.orderProduct(buyer, product);
        await myContract.completeOrder(buyer, product);

        expect(await myContract.getCredit(seller)).to.equal(price);
        expect(await myContract.getCredit(seller2)).to.equal(0);
        expect(await myContract.getCredit(buyer)).to.equal(buyerCredit - price);
      });
    });

    describe("Complaint order", () => {
      it("Order reverted, buyer credits not changed, seller got 0.", async () => {
        const seller = "seller";
        const buyer = "buyer";
        const buyerCredit = 1000;
        const product = "T-Shirt";
        const price = 123;
        const quantity = 10;

        await myContract.addCredit(buyer, buyerCredit);
        await myContract.addOffer(seller, product, price, quantity);
        await myContract.orderProduct(buyer, product);
        await myContract.complainOrder(buyer, product);

        expect(await myContract.getCredit(seller)).to.equal(0);
        expect(await myContract.getCredit(buyer)).to.equal(buyerCredit);
      });
    });
  });
});
