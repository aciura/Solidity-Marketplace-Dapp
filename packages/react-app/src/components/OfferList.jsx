import React from 'react'
import { useEventListener } from '../hooks'
import { formatEther } from '@ethersproject/units'
import styles from './OfferList.module.css'
import { ServiceContext } from '../services/ServiceContext'
import { BigNumber } from '@ethersproject/bignumber'

const orderByBlockNumberAsc = (e1, e2) => e1.blockNumber - e2.blockNumber

const OfferState = { New: 0, Ordered: 1, Completed: 2, Complaint: 3 }

export default function OfferList({ readContracts, localProvider }) {
  const events = useEventListener(
    readContracts,
    'Offers',
    'OfferAdded',
    localProvider,
    1,
  ).sort(orderByBlockNumberAsc)

  const { orderService } = React.useContext(ServiceContext)
  const [offers, setOffers] = React.useState([])

  const runAsync = async () => {
    const _offers = await orderService.getAllOffers()
    console.log('runAsync offers:', _offers)
    if (_offers?.length) setOffers(_offers)
  }

  React.useEffect(() => {
    runAsync()
  }, [events])

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
    <div className={styles.answers}>
      <h2>Current offers</h2>
      <table className={styles.offers}>
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
      <table className={styles.offers}>
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
      <table className={styles.offers}>
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

function Offer({ id, offer, orderOffer, completeOrder, complainOrder }) {
  const { product, priceInWei, seller, buyer, state } = offer
  const isOrdered = !BigNumber.from(buyer).isZero()
  const isFinal = state > OfferState.Ordered
  return (
    <tr className={styles.offer}>
      <td>{product}</td>
      <td>Ξ{formatEther(priceInWei ?? 0)}</td>
      <td>{seller?.toString().substring(0, 8)}...</td>
      <td>{isOrdered ? `${buyer?.toString().substring(0, 8)}...` : ''}</td>
      <td>
        {isFinal ? null : isOrdered ? (
          <>
            <button onClick={() => completeOrder(id)}>Complete</button>
            <button onClick={() => complainOrder(id)}>Complain</button>
          </>
        ) : (
          <button onClick={() => orderOffer(id)}>Order</button>
        )}
      </td>
    </tr>
  )
}
