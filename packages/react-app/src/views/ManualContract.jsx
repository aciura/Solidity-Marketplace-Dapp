import React from "react";
import { Button, Divider, Input } from "antd";
import { parseEther, formatEther } from "@ethersproject/units";
import { Address } from "../components";

export function ManualContract({
  setOwner,
  setCreditValue,
  tx,
  writeContracts,
  owner,
  creditValue,
  address,
  mainnetProvider,
  yourLocalBalance,
  readContracts,
}) {
  return (
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
  );
}
