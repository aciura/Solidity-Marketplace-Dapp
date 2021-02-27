/*  Based on 🏗 scaffold-eth
    Code: https://github.com/austintgriffith/scaffold-eth
    by @austingriffith
*/
import React, { useCallback, useEffect, useState } from 'react'
import 'antd/dist/antd.css'
import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'
import { Row, Col, Button } from 'antd'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { useUserAddress } from 'eth-hooks'
import { formatEther, parseEther } from '@ethersproject/units'
import styles from './App.module.css'
import {
  useExchangePrice,
  useGasPrice,
  useUserProvider,
  useContractLoader,
  useBalance,
} from './hooks'
import { Header, Account, Faucet, Ramp, GasGauge } from './components'
import { Transactor } from './helpers'
import Marketplace from './components/Marketplace'
import EventsLog from './components/EventsLog'
import OfferList from './components/OfferList'
import AddOffer from './components/AddOffer'
import { useOrderService } from './services/orders.service'
import { ServiceContext } from './services/ServiceContext'
import { INFURA_ID } from './constants'

const DEBUG = true

const blockExplorer = 'https://etherscan.io/'
const mainnetProvider = new JsonRpcProvider(
  'https://mainnet.infura.io/v3/' + INFURA_ID,
)
const localProviderUrl = 'http://' + window.location.hostname + ':8545'
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER
  ? process.env.REACT_APP_PROVIDER
  : localProviderUrl
if (DEBUG) console.log('Connecting to provider:', localProviderUrlFromEnv)
const localProvider = new JsonRpcProvider(localProviderUrlFromEnv)
const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID,
      },
    },
  },
})

function App() {
  const [injectedProvider, setInjectedProvider] = useState()
  const price = useExchangePrice(mainnetProvider)
  /* price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice('fast')
  // Use your injected provider from 🦊 Metamask
  const userProvider = useUserProvider(injectedProvider, localProvider)
  const address = useUserAddress(userProvider)
  const tx = Transactor(userProvider, gasPrice)
  // Faucet Tx can be used to send funds from the faucet
  const faucetTx = Transactor(localProvider, gasPrice)
  const yourLocalBalance = useBalance(localProvider, address)

  const readContracts = useContractLoader(localProvider)
  const writeContracts = useContractLoader(userProvider)
  const orderService = useOrderService(tx, readContracts, writeContracts)

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect()
    setInjectedProvider(new Web3Provider(provider))
  }, [setInjectedProvider])

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal()
    }
  }, [loadWeb3Modal])

  let faucetHint = ''
  const [faucetClicked, setFaucetClicked] = useState(false)
  if (
    !faucetClicked &&
    localProvider &&
    localProvider._network &&
    localProvider._network.chainId === 31337 &&
    yourLocalBalance &&
    formatEther(yourLocalBalance) <= 0
  ) {
    faucetHint = (
      <div style={{ padding: 16 }}>
        <Button
          type="primary"
          onClick={() => {
            faucetTx({
              to: address,
              value: parseEther('0.01'),
            })
            setFaucetClicked(true)
          }}
        >
          💰 Grab funds from the faucet ⛽️
        </Button>
      </div>
    )
  }

  return (
    <div className={styles.App}>
      <Header />

      <ServiceContext.Provider value={{ orderService }}>
        <div className={styles.main}>
          <div>
            <Marketplace address={address} localProvider={localProvider} />
            <AddOffer />
          </div>
          <OfferList
            address={address}
            readContracts={readContracts}
            localProvider={localProvider}
          />
        </div>
        <EventsLog
          readContracts={readContracts}
          localProvider={localProvider}
        />
      </ServiceContext.Provider>

      {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
      <div
        style={{
          position: 'fixed',
          textAlign: 'right',
          right: 0,
          top: 0,
          padding: 10,
        }}
      >
        <Account
          address={address}
          localProvider={localProvider}
          userProvider={userProvider}
          mainnetProvider={mainnetProvider}
          price={price}
          web3Modal={web3Modal}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
          blockExplorer={blockExplorer}
        />
        {faucetHint}
      </div>

      {/* 🗺 Extra UI like gas price, eth price, faucet, and support: */}
      <div
        style={{
          position: 'fixed',
          textAlign: 'left',
          left: 0,
          bottom: 20,
          padding: 10,
        }}
      >
        <Row align="middle" gutter={[4, 4]}>
          <Col span={8}>
            <Ramp price={price} address={address} />
          </Col>

          <Col span={8} style={{ textAlign: 'center', opacity: 0.8 }}>
            <GasGauge gasPrice={gasPrice} />
          </Col>
          <Col span={8} style={{ textAlign: 'center', opacity: 1 }}>
            <Button
              onClick={() => {
                window.open('https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA')
              }}
              size="large"
              shape="round"
            >
              <span style={{ marginRight: 8 }} role="img" aria-label="support">
                💬
              </span>
              Support
            </Button>
          </Col>
        </Row>

        <Row align="middle" gutter={[4, 4]}>
          <Col span={24}>
            {
              /*  if the local provider has a signer, let's show the faucet:  */
              localProvider &&
              localProvider.connection &&
              localProvider.connection.url &&
              localProvider.connection.url.indexOf(window.location.hostname) >=
                0 &&
              !process.env.REACT_APP_PROVIDER &&
              price > 1 ? (
                <Faucet
                  localProvider={localProvider}
                  price={price}
                  ensProvider={mainnetProvider}
                />
              ) : (
                ''
              )
            }
          </Col>
        </Row>
      </div>
    </div>
  )
}

const logoutOfWeb3Modal = async () => {
  await web3Modal.clearCachedProvider()
  setTimeout(() => {
    window.location.reload()
  }, 1)
}

export default App
