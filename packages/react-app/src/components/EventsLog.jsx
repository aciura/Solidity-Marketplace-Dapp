import React from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { useEventListener } from '../hooks'
import styles from './EventsLog.module.css'

const orderByBlockNumberAsc = (e1, e2) => e1.blockNumber - e2.blockNumber
const CONTRACT_DECIMALS = 100

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
  ).sort(orderByBlockNumberAsc)
  console.log('EventsLog Events', offerAddedEvents)

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
  ).sort(orderByBlockNumberAsc)

  return (
    <div className={styles.events}>
      <h2>Events:</h2>
      <table>
        <thead>
          <tr>
            <th>Block</th>
            <th>Event</th>
            <th>Buyer</th>
            <th>Seller</th>
            <th>Product</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {offerAddedEvents &&
            offerAddedEvents.map(event => {
              // const {
              //   blockNumber,
              //   sender,
              //   buyer,
              //   seller,
              //   value,
              //   product,
              //   eventType,
              // } = event

              return (
                <tr key={event.offerId.toString()}>
                  <td>{event.blockNumber}</td>
                  {/* <td>{event.id.toString()}</td> */}
                  <td>{event.offer.product}</td>
                  <td>{event.offer.priceInWei.toString()}</td>
                  <td>{event.offer.seller.toString()}</td>
                </tr>
              )
            })}
        </tbody>
      </table>
    </div>
  )
}
