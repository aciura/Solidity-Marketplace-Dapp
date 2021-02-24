import React from 'react'
import { Button } from 'antd'
import { parseEther } from '@ethersproject/units'
import Balance from './Balance'
import { ServiceContext } from '../services/ServiceContext'

import styles from './Marketplace.module.css'

export default function Marketplace({ address, localProvider }) {
  const [ethToDeposit, setEthToDeposit] = React.useState('')
  const [userCredits, setUserCredits] = React.useState(0)
  const { orderService } = React.useContext(ServiceContext)
  const [productName, setProductName] = React.useState('')
  const [price, setPrice] = React.useState(0)

  const depositChange = event => {
    console.log('deposit changed', event.target.value)
    setEthToDeposit(event.target.value)
  }

  const getCreditAsync = async () => {
    const value = await orderService.getCredit(address)
    console.log('User Credits:', value?.toString())
    if (value) setUserCredits(value?.toString())
  }

  const deposit = async () => {
    const ethInWei = parseEther(ethToDeposit)
    console.log('deposit', ethInWei)
    await orderService.depositEth(ethInWei)
    getCreditAsync()
  }

  const addOffer = async () => {
    const ethInWei = parseEther(price)
    const result = await orderService.addOffer(productName, ethInWei)
    console.log('addOffer', result)
    //TODO: get offers? should watch for OfferAdded event
  }

  React.useEffect(() => {
    getCreditAsync()
  }, [orderService])

  return (
    <div className={styles.marketplace}>
      <div className={styles.input}>
        <h2>Deposit ETH</h2>
        <Balance address={address} provider={localProvider} />
        <input
          placeholder="hom much ETH to deposit"
          value={ethToDeposit}
          onChange={depositChange}
        />
        <Button onClick={deposit}>Deposit</Button>

        <span style={{ color: 'red' }}>
          TEMPORARY: User credits: {userCredits}
        </span>
      </div>

      <div className={styles.input}>
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
    </div>
  )
}
