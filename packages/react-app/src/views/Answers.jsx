import React from "react";
import { BigNumber } from "@ethersproject/bignumber";
import { useEventListener } from "../hooks";
import styles from "./Answers.module.css";

const orderByBlockNumberAsc = (e1, e2) => e1.blockNumber - e2.blockNumber;
const CONTRACT_DECIMALS = 100;

export default function Answers({ readContracts, localProvider }) {
  const events = useEventListener(readContracts, "Marketplace", "Escrow", localProvider, 1).sort(orderByBlockNumberAsc);

  const [buyer1, setBuyer1] = React.useState("");
  const [seller2, setSeller2] = React.useState("");
  const [valueInEscrow, setValueInEscrow] = React.useState("");

  React.useEffect(() => {
    if (readContracts) {
      readContracts.Marketplace.getCredit("Buyer 1").then(result => {
        setBuyer1(BigNumber.from(result).div(CONTRACT_DECIMALS).toString());
      });
      readContracts.Marketplace.getCredit("Seller 2").then(result => {
        setSeller2(BigNumber.from(result).div(CONTRACT_DECIMALS).toString());
      });
    }

    if (events) {
      const totalInEscrow = events.reduce((acc, e) => {
        const value = BigNumber.from(e.value).div(CONTRACT_DECIMALS);
        return e.eventType === "ORDER" ? acc.add(value) : acc.sub(value);
      }, BigNumber.from(0));
      setValueInEscrow(totalInEscrow.toString());
    }
  }, [readContracts, events]);

  return (
    <div className={styles.answers}>
      <span>
        Buyer 1 balance: <strong>{buyer1}</strong>
      </span>
      <span>
        Seller 2 balance: <strong>{seller2}</strong>
      </span>
      <span>
        Total Escrow amount: <strong>{valueInEscrow}</strong>
      </span>
    </div>
  );
}
