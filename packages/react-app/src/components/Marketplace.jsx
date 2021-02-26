import React from 'react'
import { Button } from 'antd'
import { parseEther, formatEther } from '@ethersproject/units'
import Balance from './Balance'
import { ServiceContext } from '../services/ServiceContext'
import { BigNumber } from '@ethersproject/bignumber'

import styles from './Marketplace.module.css'

export default function Marketplace({ address, localProvider }) {
  const [ethToDeposit, setEthToDeposit] = React.useState('')
  const [ethToWithdraw, setEthToWithdraw] = React.useState('')

  const [userCreditsBN, setUserCreditsBN] = React.useState(BigNumber.from(0))
  const { orderService } = React.useContext(ServiceContext)

  const depositChange = event => {
    setEthToDeposit(event.target.value)
  }

  const withdrawChange = event => {
    setEthToWithdraw(event.target.value)
  }

  const getCreditAsync = async () => {
    const value = await orderService.getCredit(address)
    if (value) setUserCreditsBN(value)
  }

  const deposit = async () => {
    const ethInWei = parseEther(ethToDeposit)
    await orderService.depositEth(ethInWei)
    getCreditAsync()
  }

  const withdraw = async () => {
    const ethInWei = parseEther(ethToWithdraw)
    await orderService.withdrawEth(ethInWei)
    getCreditAsync()
  }

  React.useEffect(() => {
    getCreditAsync()
  }, [orderService])

  return (
    <div className={styles.marketplace}>
      <h2>Marketplace</h2>
      <div>
        Account balance:
        <Balance address={address} provider={localProvider} />
      </div>
      <div>Balance in contract: Ξ{formatEther(userCreditsBN)}</div>
      <div className={styles.input}>
        <h3>Deposit ETH to contract</h3>
        <input
          placeholder="how much ETH to deposit?"
          value={ethToDeposit}
          onChange={depositChange}
        />
        <Button onClick={deposit}>Deposit</Button>
      </div>

      <div className={styles.input}>
        <h3>Withdraw ETH from contract</h3>

        <input
          placeholder="how much ETH to withdraw?"
          value={ethToWithdraw}
          onChange={withdrawChange}
        />
        <Button onClick={withdraw}>Withdraw</Button>
      </div>
    </div>
  )
}
