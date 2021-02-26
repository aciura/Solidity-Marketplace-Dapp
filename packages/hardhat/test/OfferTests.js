const { ethers } = require('hardhat')
const { use, expect } = require('chai')
const { solidity } = require('ethereum-waffle')

use(solidity)
use(require('chai-as-promised'))

describe('Offers', async () => {
  let myContract
  let [owner, addr1, addr2] = [0, 0, 0]

  beforeEach(async () => {
    const OffersContract = await ethers.getContractFactory('Offers')
    myContract = await OffersContract.deploy()
    ;[owner, addr1, addr2] = await ethers.getSigners()
  })

  const addOffer = async (
    product = 'Tesla3',
    valueBN = ethers.utils.parseEther('1.23'),
  ) => {
    const transaction = await myContract
      .connect(addr1)
      .addOffer(product, valueBN)

    const receipt = await transaction.wait()
    const offerId = receipt.events[0].args[0]

    const offer = await myContract.getOffer(offerId)
    return { offerId, offer }
  }

  describe('Add offer', () => {
    it('Should add new offer', async () => {
      const product = 'Tesla3'
      const valueBN = ethers.utils.parseEther('1.23')

      const { offer } = await addOffer(product, valueBN)

      expect(offer.seller.toString()).to.equal(addr1.address.toString())
      expect(offer.product).to.equal(product)
      expect(offer.priceInWei).to.equal(valueBN)
    })

    it('Offer should be visible for other people', async () => {
      const product = 'Tesla3'
      const valueBN = ethers.utils.parseEther('1.23')

      const { offerId } = await addOffer(product, valueBN)

      const offer = await myContract.connect(addr2).getOffer(offerId)

      expect(offer.seller.toString()).to.equal(addr1.address.toString())
      expect(offer.product).to.equal(product)
      expect(offer.priceInWei).to.equal(valueBN)
    })

    it(`Should not allow to set offer's buyer without correct OrderContract set`, async () => {
      const product = 'Tesla3'
      const valueBN = ethers.utils.parseEther('1.23')
      const { offerId } = await addOffer(product, valueBN)

      // await myContract.connect(owner).setOrderContractAddress(owner.address)

      await expect(
        myContract.connect(addr2).setBuyerForOffer(offerId, addr2.address),
      ).to.be.rejectedWith(/revert Can be only called by OrderContract/)

      const offer = await myContract.connect(addr2).getOffer(offerId)
      expect(offer.buyer).to.equal('0x0000000000000000000000000000000000000000')
    })

    it(`Should allow to set offer's buyer`, async () => {
      const product = 'Tesla3'
      const valueBN = ethers.utils.parseEther('1.23')
      const { offerId } = await addOffer(product, valueBN)

      await myContract.connect(owner).setOrderContractAddress(owner.address)
      await myContract.connect(owner).setBuyerForOffer(offerId, addr2.address)

      const offer = await myContract.connect(addr2).getOffer(offerId)

      expect(offer.buyer).to.equal(addr2.address)
    })

    it('Should add new offer to all offers list', async () => {
      const product1 = 'Tesla3'
      const valueBN = ethers.utils.parseEther('1.23')
      const { offerId: offerId1 } = await addOffer(product1, valueBN)
      const product2 = 'TeslaX'
      const { offerId: offerId2 } = await addOffer(product2, valueBN)

      const allOffersLength = await myContract.allOffersLength()
      expect(allOffersLength).to.equal(2)

      const offer1 = await myContract.getOfferByIndex(0)
      const offer2 = await myContract.getOfferByIndex(1)

      expect(offer1.product).to.equal(product1)
      expect(offer2.product).to.equal(product2)

      const allOfferIds = await myContract.getAllOfferIds()
      expect(allOfferIds[0]).to.equal(offerId1)
      expect(allOfferIds[1]).to.equal(offerId2)
    })
  })
})
