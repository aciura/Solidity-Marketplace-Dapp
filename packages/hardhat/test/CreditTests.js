const { ethers } = require('hardhat')
const { use, expect } = require('chai')
const { solidity } = require('ethereum-waffle')
const { BigNumber } = require('ethers')

use(solidity)
use(require('chai-as-promised'))

describe('Marketplace Dapp', async () => {
  let myContract

  it('Should deploy the contract', async () => {
    const CreditsContract = await ethers.getContractFactory('Credit')
    myContract = await CreditsContract.deploy()
  })

  describe('Marketplace', () => {
    beforeEach(async () => {
      const CreditsContract = await ethers.getContractFactory('Credit')
      myContract = await CreditsContract.deploy()
    })

    describe('Credit', async () => {
      it('Should add credit to account', async () => {
        const [owner] = await ethers.getSigners()
        const valueBN = ethers.utils.parseEther('1.23')
        const overrideOptions = { value: valueBN }
        await myContract.addCredit(overrideOptions)

        const creditBN = await myContract.getCredit(owner.address)
        console.log('credit: ', creditBN.toString())
        expect(creditBN).to.equal(valueBN)
      })

      it('Should sum credit when executed twice', async () => {
        const [owner] = await ethers.getSigners()
        const valueBN = ethers.utils.parseEther('1.23')
        const overrideOptions = { value: valueBN }
        await myContract.addCredit(overrideOptions)
        await myContract.addCredit(overrideOptions)

        const creditEndBN = await myContract.getCredit(owner.address)
        console.log('credit', creditEndBN.toString())
        expect(creditEndBN).to.equal(ethers.utils.parseEther('2.46'))
      })

      it('Should withdraw credit from account', async () => {
        const [owner] = await ethers.getSigners()
        const valueBN = ethers.utils.parseEther('1.23')
        const overrideOptions = { value: valueBN }
        await myContract.addCredit(overrideOptions)

        await myContract.withdrawCredit(valueBN)

        const creditBN = await myContract.getCredit(owner.address)
        console.log('credit: ', creditBN.toString())
        expect(creditBN).to.equal(BigNumber.from(0))
      })

      it('Should not withdraw credit from other address', async () => {
        const [owner, addr1] = await ethers.getSigners()
        const valueBN = ethers.utils.parseEther('1.23')
        const overrideOptions = { value: valueBN }
        await myContract.connect(addr1).addCredit(overrideOptions)

        // https://stackoverflow.com/questions/45466040/verify-that-an-exception-is-thrown-using-mocha-chai-and-async-await#45496509
        await expect(
          myContract.connect(owner).withdrawCredit(valueBN),
        ).to.be.rejectedWith(/revert Not enough credits/)

        const creditBN = await myContract.getCredit(addr1.address)
        console.log('credit: ', creditBN.toString())
        expect(creditBN).to.equal(valueBN)
      })

      it('Should not withdraw more credit then deposited', async () => {
        const [owner] = await ethers.getSigners()
        const valueBN = ethers.utils.parseEther('1.23')
        const overrideOptions = { value: valueBN }

        await myContract.addCredit(overrideOptions)

        const biggerValueBN = ethers.utils.parseEther('2.46')
        await expect(
          myContract.withdrawCredit(biggerValueBN),
        ).to.be.rejectedWith(/revert Not enough credits/)

        const creditBN = await myContract.getCredit(owner.address)
        console.log('credit: ', creditBN.toString())
        expect(creditBN).to.equal(valueBN)
      })
    })
  })
})
