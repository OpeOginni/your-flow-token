"use client";

import "../../../flow/config";
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import { Button, ButtonGroup } from "@chakra-ui/react";
import Header from "@/components/header";

export default function Home() {
  const [user, setUser] = useState({ loggedIn: null });
  const [name, setName] = useState("");
  const [transactionStatus, setTransactionStatus] = useState(null);

  useEffect(() => {
    fcl.currentUser.subscribe(setUser);
  }, []);

  const sendQuery = async () => {
    const profile = await fcl.query({
      // query
      cadence: `
        import Profile from 0xProfile

        pub fun main(address: Address): Profile.ReadOnly? {
          return Profile.read(address)
        }
      `,
      args: (arg, t) => [arg(user.addr, t.Address)],
    });

    setName(profile?.name ?? "No Profile");
  };

  const initAccount = async () => {
    const transactionId = await fcl.mutate({
      // mutate
      cadence: `
        import Profile from 0xProfile

        transaction {
          prepare(account: AuthAccount) {
            // Only initialize the account if it hasn't already been initialized
            if (!Profile.check(account.address)) {
              // This creates and stores the profile in the user's account
              account.save(<- Profile.new(), to: Profile.privatePath)

              // This creates the public capability that lets applications read the profile's info
              account.link<&Profile.Base{Profile.Public}>(Profile.publicPath, target: Profile.privatePath)
            }
          }
        }
      `,
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 50,
    });

    const transaction = await fcl.tx(transactionId).onceSealed();
    console.log(transaction);
  };

  const executeTransaction = async () => {
    const transactionId = await fcl.mutate({
      cadence: `
        import Profile from 0xProfile
  
        transaction(name: String) {
          prepare(account: AuthAccount) {
            account
              .borrow<&Profile.Base{Profile.Owner}>(from: Profile.privatePath)!
              .setName(name)
          }
        }
      `,
      args: (arg, t) => [arg("Opeyemi", t.String)],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 50,
    });

    fcl.tx(transactionId).subscribe((res) => setTransactionStatus(res.status));
  };

  return (
    <>
      <Header />
      <div>
        <h1 className="text-4xl font-bold pb-4">NFT PAGE App</h1>
        {user.loggedIn ? (
          <div> GO LOG IN </div>
        ) : (
          <div>
            <div className="text-xl">Address: {user?.addr ?? "No Address"}</div>
            <div className="text-xl">Profile Name: {name ?? "--"}</div>
            <div>Transaction Status: {transactionStatus ?? "--"}</div>
            <button
              className="rounded-lg border-2 font-bold"
              onClick={sendQuery}
            >
              Send Query
            </button>
            <button
              className="rounded-lg border-2 font-bold"
              onClick={initAccount}
            >
              Init Account
            </button>
            <button
              className="rounded-lg border-2 font-bold"
              onClick={executeTransaction}
            >
              Execute Transaction
            </button>
          </div>
        )}
      </div>
    </>
  );
}
