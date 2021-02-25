const { ethers } = require('hardhat')
const { use, expect } = require('chai')
const { solidity } = require('ethereum-waffle')

use(solidity)
use(require('chai-as-promised'))

describe('Order Contract', async () => {
  let orderContract
  let offersContract
  let [owner, buyer, seller] = [null, null, null]

  const addOffer = async (product = 'Tesla3', value = null) => {
    const valueBN = value || ethers.utils.parseEther('1.23')

    const transaction = await offersContract
      .connect(seller)
      .addOffer(product, valueBN)

    const receipt = await transaction.wait()
    const offerId = receipt.events[0].args[0]
    return offerId
  }

  before(async () => {
    ;[owner, buyer, seller] = await ethers.getSigners()
  })

  beforeEach(async () => {
    const OffersContractFactory = await ethers.getContractFactory('Offers')
    offersContract = await OffersContractFactory.deploy()

    const OrderContractFactory = await ethers.getContractFactory('Order')
    orderContract = await OrderContractFactory.deploy(offersContract.address)

    offersContract.setOrderContractAddress(orderContract.address)
  })

  describe('Order', () => {
    it('Should deploy contract', async () => {
      console.log('Order address:', orderContract.address)
      expect(orderContract.address).to.be.a('String')
    })

    it('Should add offer and order it', async () => {
      const price = ethers.utils.parseEther('50')
      const offerId = addOffer('Tesla S', price)
      const valueBN = ethers.utils.parseEther('105.0')
      await orderContract.connect(buyer).addCredit({ value: valueBN })

      const trans = await orderContract.connect(buyer).orderProduct(offerId)
      const receipt = await trans.wait()
      const event = receipt.events[0].args

      expect(event.buyer).to.equal(buyer.address)
      expect(event.seller).to.equal(seller.address)
      expect(event.value).to.equal(price)
      expect(event.product).to.equal('Tesla S')
      expect(event.eventType).to.equal('ORDER')
    })

    it('Should create escrow after a product order', async () => {
      const price = ethers.utils.parseEther('50')
      const offerId = addOffer('Tesla S', price)
      const valueBN = ethers.utils.parseEther('105.0')
      await orderContract.connect(buyer).addCredit({ value: valueBN })

      await orderContract.connect(buyer).orderProduct(offerId)

      const escrow = await orderContract.getEscrow(buyer.address, offerId)

      expect(escrow.seller).to.equal(seller.address)
      expect(escrow.product).to.equal('Tesla S')
      expect(escrow.priceInWei).to.equal(price)
    })

    it('Should assign buyer to offer after a product order', async () => {
      const price = ethers.utils.parseEther('50')
      const offerId = addOffer('Tesla S', price)
      const valueBN = ethers.utils.parseEther('105.0')
      await orderContract.connect(buyer).addCredit({ value: valueBN })

      await orderContract.connect(buyer).orderProduct(offerId)

      const offer = await offersContract.getOffer(offerId)
      expect(offer.buyer).to.equal(buyer.address)
    })

    it('Should fail when product is ordered twice', async () => {
      const price = ethers.utils.parseEther('50')
      const offerId = addOffer('Tesla S', price)
      const valueBN = ethers.utils.parseEther('205.0')
      await orderContract.connect(buyer).addCredit({ value: valueBN })

      await orderContract.connect(buyer).orderProduct(offerId)
      await expect(
        orderContract.connect(buyer).orderProduct(offerId),
      ).to.be.rejectedWith(/revert Offer is not available/)
    })

    it('Should revert when buyer does not have enough credit', async () => {
      const offerId = addOffer()
      // https://stackoverflow.com/questions/45466040/verify-that-an-exception-is-thrown-using-mocha-chai-and-async-await#45496509
      await expect(orderContract.orderProduct(offerId)).to.be.rejectedWith(
        /revert Buyer does not have enough credits/,
      )
    })

    it('Should complete order and release credits to seller', async () => {
      const price = ethers.utils.parseEther('45')
      const offerId = addOffer('Tesla Y', price)

      const buyerCreditsAtStart = ethers.utils.parseEther('105.0')
      await orderContract
        .connect(buyer)
        .addCredit({ value: buyerCreditsAtStart })

      await orderContract.connect(buyer).orderProduct(offerId)

      await orderContract.connect(buyer).completeOrder(offerId)

      const sellerCredits = await orderContract.getCredit(seller.address)
      expect(sellerCredits).to.equal(price)

      const buyerCredits = await orderContract.getCredit(buyer.address)
      expect(buyerCredits).to.equal(ethers.utils.parseEther('60'))

      const escrow = await orderContract.getEscrow(buyer.address, offerId)
      expect(escrow.seller).to.equal(
        '0x0000000000000000000000000000000000000000',
      )
      expect(escrow.product).to.equal('')
      expect(escrow.priceInWei).to.equal(0)
    })

    it('Should complain order and release credits back to buyer', async () => {
      const price = ethers.utils.parseEther('45')
      const offerId = addOffer('Tesla Y', price)

      const buyerCreditsAtStart = ethers.utils.parseEther('105.0')
      await orderContract
        .connect(buyer)
        .addCredit({ value: buyerCreditsAtStart })

      await orderContract.connect(buyer).orderProduct(offerId)
      await orderContract.connect(buyer).complainOrder(offerId)

      const sellerCredits = await orderContract.getCredit(seller.address)
      expect(sellerCredits).to.equal(0)

      const buyerCredits = await orderContract.getCredit(buyer.address)
      expect(buyerCredits).to.equal(buyerCreditsAtStart)

      const escrow = await orderContract.getEscrow(buyer.address, offerId)
      expect(escrow.seller).to.equal(
        '0x0000000000000000000000000000000000000000',
      )
      expect(escrow.product).to.equal('')
      expect(escrow.priceInWei).to.equal(0)
    })
  })
})
