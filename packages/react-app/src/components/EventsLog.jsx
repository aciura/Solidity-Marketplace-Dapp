import React from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { useEventListener } from '../hooks'
import styles from './EventsLog.module.css'

const orderByBlockNumberAsc = (e1, e2) => e1.blockNumber - e2.blockNumber
const CONTRACT_DECIMALS = 100

export default function EventsLog({ readContracts, localProvider }) {
  const events = useEventListener(
    readContracts,
    'Offers',
    'OfferAdded',
    localProvider,
    1,
  ).sort(orderByBlockNumberAsc)
  console.log('Events', events)

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
          {events &&
            events.map(event => {
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
                <tr key={event.id.toString()}>
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
