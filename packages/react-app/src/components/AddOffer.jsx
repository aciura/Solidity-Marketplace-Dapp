import React from 'react'
import { Button } from 'antd'
import { parseEther, formatEther } from '@ethersproject/units'
import { ServiceContext } from '../services/ServiceContext'

import styles from './AddOffer.module.css'

export default function AddOffer() {
  const [productName, setProductName] = React.useState('')
  const [price, setPrice] = React.useState('')

  const { orderService } = React.useContext(ServiceContext)

  const addOffer = async () => {
    const ethInWei = parseEther(price)
    const result = await orderService.addOffer(productName, ethInWei)
    console.log('addOffer', result)
  }

  return (
    <div className={styles.panel}>
      <h2>Add offer</h2>
      <input
        placeholder="Product name"
        value={productName}
        onChange={e => setProductName(e.target.value)}
      />
      <input
        placeholder="price in ETH"
        value={price}
        onChange={e => setPrice(e.target.value)}
      />
      <Button onClick={addOffer}>Add offer</Button>
    </div>
  )
}
