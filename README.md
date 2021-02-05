# Solidity Marketplace DAPP
 
My solution is in the smart contract `Marketplace.sol` in `packages/hardhat/contracts`.
Frontend part is in:
* `App.jsx` in `packages/react-app/src`
* Transactions parsing is done in  `/react-app/src/views/Marketplace.jsx` 
* Getting answers for the final 3 questions is in: `packages\react-app\src\views\Answers.jsx`

I based my solution on an DAPP template done by @austingriffith https://github.com/austintgriffith/scaffold-eth
however the Solidity contract and Marketplace page is my onw work.  

After starting up the project (details below) open http://localhost:3000 to see the web app.

To run transactions on local blockchain you also need some "fake-ETH", you can charge up your accound using *faucet* on the bottom-left of the page. 

## How to startup the project

In the main directory run:

```bash

yarn install

```

To startup the React page:

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
