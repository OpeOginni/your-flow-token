"use client";

import "../../flow/config";
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import { SimpleGrid, Button } from "@chakra-ui/react";
import Header from "@/components/header";
import Link from "next/link";

export default function Home() {
  const [user, setUser] = useState({ loggedIn: null });
  const [name, setName] = useState("");
  const [transactionStatus, setTransactionStatus] = useState(null);

  useEffect(() => {
    fcl.currentUser.subscribe(setUser);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center text-gWhite">
      <h1 className="text-5xl font-bold pb-4 text-center">
        Your{" "}
        <span className="text-8xl font-bold pb-4 text-center text-lightGreen">
          Flow
        </span>{" "}
        Token
      </h1>
      {user.loggedIn ? (
        <SimpleGrid columns={2} spacingX="80px" p="120px">
          <div className=" flex flex-col justify-center items-center text-gWhite">
            <h1 className="text-3xl font-bold pb-4 text-center text-lightGreen">
              Create Fungible Token
            </h1>
            <Link href="/create-flow-ft">
              <Button
                height="48px"
                width="150px"
                size="lg"
                className="rounded-xl text-gWhite bg-lightGreen font-bold hover:bg-lightGreen/60"
              >
                Create Now!
              </Button>
            </Link>
          </div>
          <div className=" flex flex-col justify-center items-center text-gWhite">
            <h1 className="text-3xl font-bold pb-4 text-center text-lightGreen">
              Create Non-Fungible Token (NFT)
            </h1>
            <Link href="/create-flow-nft">
              <Button
                height="48px"
                width="150px"
                size="lg"
                className="rounded-xl text-gWhite bg-lightGreen font-bold hover:bg-lightGreen/60"
              >
                Create Now!
              </Button>
            </Link>
          </div>
        </SimpleGrid>
      ) : (
        <div> Go on...Connect Your Wallet 😉</div>
      )}
    </div>
  );
}
