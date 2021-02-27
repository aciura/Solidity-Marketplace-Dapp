import React from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { useEventListener } from '../hooks'
import { formatEther } from '@ethersproject/units'
import styles from './EventsLog.module.css'

const orderByBlockNumberDesc = (e1, e2) => e2.blockNumber - e1.blockNumber

export default function EventsLog({ readContracts, localProvider }) {
  // event OfferAdded(uint256 indexed id, Offer offer);
  // struct Offer {
  //   address seller;
  //   string product;
  //   uint256 priceInWei;
  //   address buyer;
  // }
  const offerAddedEvents = useEventListener(
    readContracts,
    'Offers',
    'OfferAdded',
    localProvider,
    1,
  )
  console.log('OfferAdded events', offerAddedEvents)

  /* event Escrow(
    address indexed buyer,
    address indexed seller,
    uint256 offerId,
    uint256 value,
    string product,
    string eventType
  );*/
  const escrowEvents = useEventListener(
    readContracts,
    'Order',
    'Escrow',
    localProvider,
    1,
  )
  console.log('Escrow events:', escrowEvents)

  const events = offerAddedEvents
    .concat(escrowEvents)
    .sort(orderByBlockNumberDesc)

  return (
    <div className={styles.events}>
      <h2>Events:</h2>
      <table>
        <thead>
          <tr>
            <th>Block</th>
            <th>Event</th>
            <th>Product</th>
            <th>Value</th>
            <th>Seller</th>
            <th>Buyer</th>
          </tr>
        </thead>
        <tbody>
          {events?.map(event => {
            const value = event.offer?.priceInWei
              ? formatEther(event.offer?.priceInWei)
              : event.value
              ? formatEther(event.value)
              : ''

            return (
              <tr key={event.blockNumber + event.offerId.toString()}>
                <td>{event.blockNumber}</td>
                <td>{event.eventType ?? 'new offer'}</td>
                <td>{event.product ?? event.offer?.product}</td>
                <td>{value}</td>
                <td>{event?.seller ?? event.offer?.seller.toString()}</td>
                <td>{event?.seller ?? event.offer?.buyer.toString()}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
