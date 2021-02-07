# Solidity Marketplace DAPP
 
My solution is in the smart contract `Marketplace.sol` in `packages/hardhat/contracts`.

Frontend part is in:
* `App.jsx` in `packages/react-app/src`
* Transactions parsing is done in  `/react-app/src/views/Marketplace.jsx` 
* Getting answers for the final 3 questions is in: `packages\react-app\src\views\Answers.jsx`

I based my solution on a DAPP template done by @austingriffith https://github.com/austintgriffith/scaffold-eth
however the Solidity contract and Marketplace page is my onw work.  

After starting up the project (details below) open http://localhost:3000 to see the web app.

![marketplace UI](https://github.com/aciura/Solidity-Marketplace-Dapp/blob/main/Marketplace-UI.PNG?raw=true)

### How to get eth

To run transactions on local blockchain you also need some "fake-ETH", you can charge up your account using *faucet* on the bottom-left of the page. 

* copy address by clicking on the `0xFO6E` in the top-right side of the browser window (your address may be different). 
* paste the address into *faucet* on the bottol-left
* press the `PLAY` button to fill-up the wallet

### How to run Buyer & Seller transactions in the app

* Copy transactions into the `Scan list of transactions` input box. 
* Use format as in the problem description:

`
Buyer 1 | Credit | 20

Buyer 2 | Credit | 40

Seller 1 | Offer | Coffee, 3

Seller 2 | Offer | T-Shirt, 5

Seller 1 | Offer | Tea, 2.5

Seller 1 | Offer | Cake, 3.5 
`

* Press `Run transactions` button below the input box.
* Wait untill all transactions are executed in the blockchain, answer will appear in the middle panel. 

If you don't have enough fake-eth some transactions may fail and it will result in an incorrect answer. 
I would suggest having more then $50 of fake-eth in the wallet. 


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

> To deploy `Marketplace.sol` smart-contract, in a third terminal window:

```bash
yarn deploy

```
