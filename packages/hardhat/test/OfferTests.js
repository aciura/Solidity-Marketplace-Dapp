const { ethers } = require('hardhat')
const { use, expect } = require('chai')
const { solidity } = require('ethereum-waffle')

use(solidity)

describe('Offers', async () => {
  let myContract

  beforeEach(async () => {
    const OffersContract = await ethers.getContractFactory('Offers')
    myContract = await OffersContract.deploy()
  })

  describe('Add offer', () => {
    it('Should add new offer', async () => {
      const [owner, addr1] = await ethers.getSigners()
      const product = 'Tesla3'
      const valueBN = ethers.utils.parseEther('1.23')

      const transaction = await myContract
        .connect(addr1)
        .addOffer(product, valueBN)

      const receipt = await transaction.wait()
      const offerId = receipt.events[0].args[0]

      const offer = await myContract.getOffer(offerId)

      expect(offer.seller.toString()).to.equal(addr1.address.toString())
      expect(offer.product).to.equal(product)
      expect(offer.priceInWei).to.equal(valueBN)
    })

    it('Offer should be visible for other people', async () => {
      const [owner, addr1, addr2] = await ethers.getSigners()
      const product = 'Tesla3'
      const valueBN = ethers.utils.parseEther('1.23')

      const transaction = await myContract
        .connect(addr1)
        .addOffer(product, valueBN)

      const receipt = await transaction.wait()
      const offerId = receipt.events[0].args[0]

      const offer = await myContract.connect(addr2).getOffer(offerId)

      expect(offer.seller.toString()).to.equal(addr1.address.toString())
      expect(offer.product).to.equal(product)
      expect(offer.priceInWei).to.equal(valueBN)
    })
  })

  // describe("Complete order", () => {
  //   it("Should create a new offer, order product and complete order", async () => {
  //     const seller = "seller";
  //     const buyer = "buyer";
  //     const buyerCredit = 1000;
  //     const product = "T-Shirt";
  //     const price = 123;
  //     const quantity = 10;

  //     await myContract.addCredit(buyer, buyerCredit);
  //     await myContract.addOffer(seller, product, price, quantity);
  //     await myContract.orderProduct(buyer, product);
  //     await myContract.completeOrder(buyer, product);

  //     expect(await myContract.getCredit(seller)).to.equal(price);
  //     expect(await myContract.getCredit(buyer)).to.equal(buyerCredit - price);
  //     expect(await myContract.getQuantity(product)).to.equal(quantity - 1);
  //   });

  //   it("Two sellers sell the same product, only the first seller should get money", async () => {
  //     const seller = "seller";
  //     const seller2 = "seller2";
  //     const buyer = "buyer";
  //     const buyerCredit = 1000;
  //     const product = "T-Shirt";
  //     const price = 123;
  //     const quantity = 10;

  //     await myContract.addCredit(buyer, buyerCredit);
  //     await myContract.addOffer(seller, product, price, quantity);
  //     await myContract.addOffer(seller2, product, 321, 1);
  //     await myContract.orderProduct(buyer, product);
  //     await myContract.completeOrder(buyer, product);

  //     expect(await myContract.getCredit(seller)).to.equal(price);
  //     expect(await myContract.getCredit(seller2)).to.equal(0);
  //     expect(await myContract.getCredit(buyer)).to.equal(buyerCredit - price);
  //   });
  // });

  // describe("Complaint order", () => {
  //   it("Order reverted, buyer credits not changed, seller got 0.", async () => {
  //     const seller = "seller";
  //     const buyer = "buyer";
  //     const buyerCredit = 1000;
  //     const product = "T-Shirt";
  //     const price = 123;
  //     const quantity = 10;

  //     await myContract.addCredit(buyer, buyerCredit);
  //     await myContract.addOffer(seller, product, price, quantity);
  //     await myContract.orderProduct(buyer, product);
  //     await myContract.complainOrder(buyer, product);

  //     expect(await myContract.getCredit(seller)).to.equal(0);
  //     expect(await myContract.getCredit(buyer)).to.equal(buyerCredit);
  //   });
})
