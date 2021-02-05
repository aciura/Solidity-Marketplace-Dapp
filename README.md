My solution is in the smart contract `Marketplace.sol` in `packages/hardhat/contracts`.
Frontend part is in `App.jsx` in `packages/react-app/src`

After starting up the project (details below) open http://localhost:3000 to see the web app.

**_ How to startup the project _**

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
