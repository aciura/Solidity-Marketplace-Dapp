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
})
