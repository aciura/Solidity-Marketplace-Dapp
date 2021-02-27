import React from 'react'
import { formatEther } from '@ethersproject/units'
import styles from './OfferList.module.css'
import { BigNumber } from '@ethersproject/bignumber'
import { OfferState } from './OfferList'

export function Offer({ id, offer, orderOffer, completeOrder, complainOrder }) {
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
