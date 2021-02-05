/* eslint-disable jsx-a11y/accessible-emoji */

import React from "react";
import { Button, List, Divider, Input, Card, DatePicker, Slider, Switch, Progress, Spin } from "antd";
import { parseEther, formatEther } from "@ethersproject/units";
import { BigNumber } from "@ethersproject/bignumber";
import { Address, Balance } from "../components";
import styles from "./Marketplace.module.css";

// There are 2 decimal places in each 'credit' field
const CONTRACT_DECIMALS = 100;
const parseValue = priceString => parseInt(priceString.trim(), 10) * CONTRACT_DECIMALS;

function parseTransaction(row) {
  const trans = row.split("|");
  if (trans.length !== 3) throw Error("Incorrect transaction: " + row);
  const [user, action, args] = trans;
  return { user: user.trim(), action: action.trim(), args: args.trim() };
}

export default function ExampleUI({
  setPurposeEvents,
  address,
  mainnetProvider,
  yourLocalBalance,
  tx,
  readContracts,
  writeContracts,
}) {
  const [owner, setOwner] = React.useState(null);
  const [creditValue, setCreditValue] = React.useState(0);
  const textareaRef = React.useRef(null);

  async function execute(tr) {
    const { user, action, args } = tr;
    switch (action.toUpperCase()) {
      // Buyer 1 | Credit | 20
      case "CREDIT": {
        const value = parseValue(args);
        return tx(writeContracts.Marketplace.addCredit(user, value));
      }
      // Buyer 1 | Order | T-Shirt
      case "ORDER": {
        return tx(writeContracts.Marketplace.orderProduct(user, args));
      }
      // Seller 2 | Offer | T-Shirt, 5
      case "OFFER": {
        const [product, priceStr] = args.split(",");
        const price = parseValue(priceStr);
        return tx(writeContracts.Marketplace.addOffer(user, product.trim(), price));
      }
      // Buyer 1 | Complete | T-Shirt
      case "COMPLETE": {
        return tx(writeContracts.Marketplace.completeOrder(user, args));
      }
      // Buyer 2 | Complain | Hoody
      case "COMPLAIN": {
        return tx(writeContracts.Marketplace.complainOrder(user, args));
      }
      default:
        throw Error("Unknown transaction type: " + JSON.stringify(tr));
    }
  }

  const executeTransactionsInSequence = async transactions => {
    transactions.reduce((p, tr, index) => {
      return p.then(async () => {
        try {
          console.log(`execute ${index}`, tr);
          const result = await execute(tr);
          console.log(`finished execute ${index}`, tr);
          return result;
        } catch (error) {
          console.error(error);
          return Promise.reject(error);
        }
      });
    }, Promise.resolve());
  };

  const readAndExecuteTransactions = () => {
    if (textareaRef && textareaRef.current) {
      const text = textareaRef.current.value;
      const rows = text.split(/\r\n|\n\r|\n|\r/);
      const transactions = rows
        .map(rowStr => {
          const row = rowStr.trim();
          if (row.length < 5) return null;
          return parseTransaction(row, rowStr);
        })
        .filter(tr => tr != null);
      executeTransactionsInSequence(transactions);
    }
  };

  return (
    <div className={styles.marketplace}>
      <div className={styles.transactions}>
        <h2>Scan list of transactions</h2>
        <textarea name="transactions" rows="20" cols="40" ref={textareaRef} />
        <Button onClick={readAndExecuteTransactions}>Run transactions</Button>
      </div>

      <div style={{ border: "1px solid #cccccc", padding: "2rem", width: "20rem", marginTop: "1rem" }}>
        <h2>Manual Marketplace testing:</h2>
        <h4>Add credits to account</h4>
        <Divider />
        <div style={{ margin: 8 }}>
          <Input onChange={e => setOwner(e.target.value)} placeholder="Account owner" />
          <Input onChange={e => setCreditValue(e.target.value)} placeholder="Credit value" />
          <Button
            onClick={() => {
              tx(writeContracts.Marketplace.addCredit(owner, creditValue));
            }}
          >
            Add Credit
          </Button>
        </div>
        <Divider />
        Your Address:
        <Address value={address} ensProvider={mainnetProvider} fontSize={16} />
        <Divider />
        <h2>Your Balance: {yourLocalBalance ? formatEther(yourLocalBalance) : "..."}</h2>
        <Divider />
        Marketplace Contract Address:
        <Address
          value={readContracts ? readContracts.Marketplace.address : readContracts}
          ensProvider={mainnetProvider}
          fontSize={16}
        />
        <Divider />
        <div style={{ margin: 8 }}>
          <Button
            onClick={() => {
              /*
              you can also just craft a transaction and send it to the tx() transactor
              here we are sending value straight to the contract's address:
            */
              tx({
                to: writeContracts.Marketplace.address,
                value: parseEther("0.001"),
              });
              /* this should throw an error about "no fallback nor receive function" until you add it */
            }}
          >
            Send Value
          </Button>
        </div>
      </div>

      <div style={{ width: "20rem", marginTop: 32, paddingBottom: 32 }}>
        <h2>Events:</h2>
        <List
          bordered
          dataSource={setPurposeEvents}
          renderItem={item => {
            console.log("event", JSON.stringify(item));
            const { blockNumber, sender, owner, value } = item;
            return (
              <List.Item key={blockNumber + "_" + sender}>
                Account credited: {owner} =&gt; {value ? BigNumber.from(value).toString() : ""}
              </List.Item>
            );
          }}
        />
      </div>
    </div>
  );
}
