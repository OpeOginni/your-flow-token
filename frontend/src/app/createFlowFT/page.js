"use client";

import "../../../flow/testnet.config";
import { Suspense } from "react";
import * as fcl from "@onflow/fcl";
import { Button, Box, Text } from "@chakra-ui/react";
import Link from "next/link";
import UserTokensList from "../../components/userTokensList";

export default function FTPage() {
  const getUser = () => {
    return new Promise((resolve, reject) => {
      fcl.currentUser().subscribe(resolve, reject);
    });
  };

  return (
    <div>
      <div className={`main-content`}>
        <div className="flex flex-col justify-center items-center text-gWhite ">
          <h1 className="text-5xl font-bold pb-4 text-center">
            <span className="text-8xl font-bold pb-4 text-center text-lightGreen">
              Flow
            </span>{" "}
            Fungible Tokens
          </h1>
          <Box p="120px">
            <div className=" flex flex-col justify-center items-center text-gWhite">
              <h1 className="text-3xl font-bold pb-4 text-center text-lightGreen">
                Create Fungible Token
              </h1>
              <Link href="/createFlowFT/form">
                <Button
                  height="48px"
                  width="150px"
                  size="lg"
                  className="rounded-xl text-gWhite bg-lightGreen font-bold hover:bg-lightGreen/60"
                >
                  Create Now!
                </Button>
              </Link>
              <Box paddingTop="15px">
                <Link href="/">
                  <Button
                    height="40px"
                    width="110px"
                    size="lg"
                    className="rounded-xl text-sm text-gWhite bg-lightGreen font-bold hover:bg-lightGreen/60"
                  >
                    Back To Home
                  </Button>
                </Link>
              </Box>
            </div>
          </Box>
        </div>
        <Suspense fallback={<p>loading...</p>}>
          <UserTokensList
            user={getUser().then((user) => {
              return user;
            })}
          />
        </Suspense>
      </div>
    </div>
  );
}
