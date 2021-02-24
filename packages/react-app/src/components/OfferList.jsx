import React from 'react'
import { useEventListener } from '../hooks'
import { formatEther } from '@ethersproject/units'
import styles from './OfferList.module.css'
import { ServiceContext } from '../services/ServiceContext'

const orderByBlockNumberAsc = (e1, e2) => e1.blockNumber - e2.blockNumber

export default function OfferList({ address, readContracts, localProvider }) {
  const offers = useEventListener(
    readContracts,
    'Offers',
    'OfferAdded',
    localProvider,
    1,
  ).sort(orderByBlockNumberAsc)
  console.log('Events', offers)
  const { orderService } = React.useContext(ServiceContext)

  const orderOffer = offerId => {
    orderService.orderProduct(offerId)
  }
  const complainOrder = offerId => {
    orderService.complainOrder(offerId)
  }
  const completeOrder = offerId => {
    orderService.completeOrder(offerId)
  }

  return (
    <div className={styles.answers}>
      <h2>Current offers</h2>
      {offers.map(offer => (
        <Offer
          {...offer}
          orderOffer={orderOffer}
          completeOrder={completeOrder}
          complainOrder={complainOrder}
        />
      ))}
    </div>
  )
}

function Offer({ id, offer, orderOffer, completeOrder, complainOrder }) {
  const { product, priceInWei, seller } = offer

  return (
    <div key={id.toString()}>
      <span>{product}</span>&nbsp;
      <span>{formatEther(priceInWei)}</span>&nbsp;
      <span>{seller.toString().substring(0, 8)}...</span>
      <button onClick={() => orderOffer(id)}>Order</button>
      <button onClick={() => completeOrder(id)}>Complete</button>
      <button onClick={() => complainOrder(id)}>Complain</button>
    </div>
  )
}
