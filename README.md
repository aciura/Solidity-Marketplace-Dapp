# Solidity P2P Marketplace DAPP

Simple Peer-2-Peer marketplace DApp that allows:

- Deposit and withdraw ETH from Smart contract [(Credit.sol)](https://github.com/aciura/Solidity-Marketplace-Dapp/blob/main/packages/hardhat/contracts/Credit.sol)
- Adding sell offers for products [(Offers.sol)](https://github.com/aciura/Solidity-Marketplace-Dapp/blob/main/packages/hardhat/contracts/Offers.sol)
- Ordering products by buyers [(Order.sol)](https://github.com/aciura/Solidity-Marketplace-Dapp/blob/main/packages/hardhat/contracts/Order.sol)
- Making an order creates an escrow account that secures the payment for the product [(Order.sol)](https://github.com/aciura/Solidity-Marketplace-Dapp/blob/a544b943a571b071093f3d3287945920ee42ec37/packages/hardhat/contracts/Order.sol#L33)
- Buyer can complete the purchase when he receives the product, which moves credits from escrow to the seller's account [(Order.completeOrder())](https://github.com/aciura/Solidity-Marketplace-Dapp/blob/a544b943a571b071093f3d3287945920ee42ec37/packages/hardhat/contracts/Order.sol#L49).
- Buyer can complain the product, which returns money from escrow to the buyer's account [(Order.complaintOrder())](https://github.com/aciura/Solidity-Marketplace-Dapp/blob/a544b943a571b071093f3d3287945920ee42ec37/packages/hardhat/contracts/Order.sol#L73).

See all solidity smart contracts in `packages/hardhat/contracts`.
Blockchain part is using: [hardhat](https://hardhat.org/), @openzeppelin/contracts.

Smart-contract testing is done in: [tests](https://github.com/aciura/Solidity-Marketplace-Dapp/tree/main/packages/hardhat/test), 
it's using: chai, ethereum-waffle and ethers/hardhat.

Frontend part is in:

- `App.jsx` in `packages/react-app/src`
- Sending orders to blockchain is done using [Ethers v5](https://docs.ethers.io/v5/)

I've based my solution on a DAPP template done by @austingriffith https://github.com/austintgriffith/scaffold-eth however the Solidity contracts and Marketplace page is my onw work.

After starting up the project (details below) open http://localhost:3000 to see the web app.

![marketplace UI](https://github.com/aciura/Solidity-Marketplace-Dapp/blob/main/Marketplace-UI.PNG?raw=true)

### How to get eth

To run transactions on local blockchain you also need some "fake-ETH", you can charge up your account using _faucet_ on the bottom-left of the page.

- copy address by clicking on the `0xFO6E` in the top-right side of the browser window (your address may be different).
- paste the address into _faucet_ on the bottol-left
- press the `PLAY` button to fill-up the wallet

## How to startup the project

In the main directory run:

```bash

yarn install

```

> To startup the React page:

```bash

yarn start

```

> To startup local blockchain, in a second terminal window type:

```bash
yarn chain

```

> To deploy smart-contracts, in a third terminal window:

```bash
yarn deploy

```
