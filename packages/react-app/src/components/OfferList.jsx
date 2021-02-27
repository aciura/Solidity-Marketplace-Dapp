import React from 'react'
import { useEventListener } from '../hooks'
import styles from './OfferList.module.css'
import { ServiceContext } from '../services/ServiceContext'
import { Offer } from './Offer'

const orderByBlockNumberDesc = (e1, e2) => e2.blockNumber - e1.blockNumber

export const OfferState = { New: 0, Ordered: 1, Completed: 2, Complaint: 3 }

export default function OfferList({ readContracts, localProvider }) {
  const { orderService } = React.useContext(ServiceContext)
  const [offers, setOffers] = React.useState([])

  const offerAddedEvents = useEventListener(
    readContracts,
    'Offers',
    'OfferAdded',
    localProvider,
    1,
  )
  const escrowEvents = useEventListener(
    readContracts,
    'Order',
    'Escrow',
    localProvider,
    1,
  )
  const events = offerAddedEvents.concat(escrowEvents)

  const runAsync = async () => {
    const _offers = await orderService.getAllOffers()
    console.log('runAsync offers:', _offers)
    if (_offers?.length) setOffers(_offers)
  }

  React.useEffect(() => {
    runAsync()
  }, [events.length])

  const orderOffer = async offerId => {
    await orderService.orderProduct(offerId)
    runAsync()
  }
  const complainOrder = offerId => {
    orderService.complainOrder(offerId)
  }
  const completeOrder = offerId => {
    orderService.completeOrder(offerId)
  }

  console.log('OfferList offers', offers)
  return (
    <div className={styles.offers}>
      <h2>Current offers</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Seller</th>
            <th>Buyer</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {offers
            ?.filter(offer =>
              [OfferState.New, OfferState.Ordered].includes(offer.state),
            )
            .map(offer => (
              <Offer
                key={offer?.id}
                id={offer?.id}
                offer={offer}
                orderOffer={orderOffer}
                completeOrder={completeOrder}
                complainOrder={complainOrder}
              />
            ))}
        </tbody>
      </table>
      <h3>Completed</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Seller</th>
            <th>Buyer</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {offers
            ?.filter(offer => [OfferState.Completed].includes(offer.state))
            .map(offer => (
              <Offer key={offer?.id} id={offer?.id} offer={offer} />
            ))}
        </tbody>
      </table>
      <h3>Complained</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Seller</th>
            <th>Buyer</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {offers
            ?.filter(offer => [OfferState.Complaint].includes(offer.state))
            .map(offer => (
              <Offer key={offer?.id} id={offer?.id} offer={offer} />
            ))}
        </tbody>
      </table>
    </div>
  )
}
