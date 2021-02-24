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

  getCredit(address) {
    console.log('getCredit', address)
    return this.readContracts?.Order.getCredit(address)
  }

  addOffer(productName, ethInWei) {
    console.log('addOffer', productName, ethInWei)
    return this.writeContracts.Offers.addOffer(productName, ethInWei)
  }

  orderProduct(offerId) {
    console.log('orderProduct', offerId)
    return this.writeContracts.Order.orderProduct(offerId)
  }

  completeOrder(offerId) {
    console.log('completeOrder', offerId)
    return this.writeContracts.Order.completeOrder(offerId)
  }

  complainOrder(offerId) {
    console.log('complainOrder', offerId)
    return this.writeContracts.Order.complainOrder(offerId)
  }
}

export const useOrderService = (tx, readContracts, writeContracts) => {
  const orderService = React.useMemo(() => {
    console.log('useMEMO new orderService')
    return new OrderService(tx, readContracts, writeContracts)
  }, [readContracts, writeContracts])
  return orderService
}

// async function execute(tr) {
//   const { user, action, args } = tr
//   switch (action.toUpperCase()) {
//     // Buyer 1 | Credit | 20
//     case 'CREDIT': {
//       const value = parseValue(args)
//       return tx(writeContracts.Order.addCredit(user, value))
//     }
//     // Buyer 1 | Order | T-Shirt
//     case 'ORDER': {
//       return tx(writeContracts.Order.orderProduct(user, args))
//     }
//     // Seller 2 | Offer | T-Shirt, 5
//     case 'OFFER': {
//       const [product, priceStr] = args.split(',')
//       const price = parseValue(priceStr)
//       return tx(writeContracts.Offers.addOffer(user, product.trim(), price))
//     }
//     // Buyer 1 | Complete | T-Shirt
//     case 'COMPLETE': {
//       return tx(writeContracts.Order.completeOrder(user, args))
//     }
//     // Buyer 2 | Complain | Hoody
//     case 'COMPLAIN': {
//       return tx(writeContracts.Order.complainOrder(user, args))
//     }
//     default:
//       throw Error('Unknown transaction type: ' + JSON.stringify(tr))
//   }
// }
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
