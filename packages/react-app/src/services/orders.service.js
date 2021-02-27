import React from 'react'

export class OrderService {
  constructor(tx, readContracts, writeContracts) {
    console.log('OrderService', readContracts)
    this.tx = tx
    this.readContracts = readContracts
    this.writeContracts = writeContracts
  }

  depositEth(value) {
    console.log('depositEth', value)
    return this.tx(
      this.writeContracts.Order.addCredit({
        value,
      }),
    )
  }

  withdrawEth(ethInWei) {
    console.log('withdraw', ethInWei)
    return this.tx(this.writeContracts.Order.withdrawCredit(ethInWei))
  }

  getCredit(address) {
    console.log('getCredit', address)
    return this.readContracts?.Order.getCredit(address)
  }

  addOffer(productName, ethInWei) {
    console.log('addOffer', productName, ethInWei)
    return this.tx(this.writeContracts.Offers.addOffer(productName, ethInWei))
  }

  orderProduct(offerId) {
    console.log('orderProduct', offerId)
    return this.tx(this.writeContracts.Order.orderProduct(offerId))
  }

  completeOrder(offerId) {
    console.log('completeOrder', offerId)
    return this.tx(this.writeContracts.Order.completeOrder(offerId))
  }

  complainOrder(offerId) {
    console.log('complainOrder', offerId)
    return this.tx(this.writeContracts.Order.complainOrder(offerId))
  }

  async getAllOffers() {
    const offerIds = await this.readContracts?.Offers.getAllOfferIds()
    const offers = offerIds?.map(async (offerId, i) => {
      const offer = await this.readContracts?.Offers.getOffer(offerId)
      return { ...offer, id: offerId.toString() }
    })
    const result = await Promise.all(offers ?? [])
    return result
  }
}

export const useOrderService = (tx, readContracts, writeContracts) => {
  const orderService = React.useMemo(() => {
    console.log('useMEMO new orderService')
    return new OrderService(tx, readContracts, writeContracts)
  }, [readContracts, writeContracts])
  return orderService
}

// const executeTransactionsInSequence = async transactions => {
//   transactions.reduce((p, tr, index) => {
//     return p.then(async () => {
//       try {
//         console.log(`execute ${index}`, tr)
//         const result = await execute(tr)
//         console.log(`finished execute ${index}`, tr)
//         return result
//       } catch (error) {
//         console.error(error)
//         return Promise.reject(error)
//       }
//     })
//   }, Promise.resolve())
// }
