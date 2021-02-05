import React from "react";
import { BigNumber } from "@ethersproject/bignumber";
import { useEventListener } from "../hooks";
import styles from "./EventsLog.module.css";

const orderByBlockNumberAsc = (e1, e2) => e1.blockNumber - e2.blockNumber;
const CONTRACT_DECIMALS = 100;

export default function EventsLog({ readContracts, localProvider }) {
  const events = useEventListener(readContracts, "Marketplace", "Escrow", localProvider, 1).sort(orderByBlockNumberAsc);

  return (
    <div className={styles.events}>
      <h2>Events:</h2>
      <table>
        <thead>
          <tr>
            <th>Block</th>
            <th>Event</th>
            <th>Buyer</th>
            <th>Seller</th>
            <th>Product</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {events &&
            events.map(event => {
              const { blockNumber, sender, buyer, seller, value, product, eventType } = event;
              return (
                <tr key={blockNumber + "_" + sender}>
                  <td>{blockNumber}</td>
                  <td>{eventType}</td>
                  <td>{buyer}</td>
                  <td>{seller}</td>
                  <td>{product}</td>
                  <td>{value ? BigNumber.from(value).div(CONTRACT_DECIMALS).toString() : ""}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
