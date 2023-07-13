"use client";

import "../../../../flow/testnet.config";
import { Suspense } from "react";
import * as fcl from "@onflow/fcl";
import { Button, Box, Badge, Center } from "@chakra-ui/react";
import Link from "next/link";
import UserTokensList from "../../../components/userTokensList";

import { usePathname } from "next/navigation";
import { flowConfig } from "../../../utils/flowConfig.util";

export default function FTPage() {
  // Get the PathName to know which Network the User is On
  const pathName = usePathname();
  const networkType = pathName.split("/")[1].toLocaleUpperCase();

  // Use the Flow Config settings of the specific network the user is on
  flowConfig(networkType);
  const getUser = () => {
    return new Promise((resolve, reject) => {
      fcl.currentUser().subscribe(resolve, reject);
    });
  };

  return (
    <div>
      <div className={`content`}>
        <div className="flex flex-col justify-center items-center text-gWhite">
          <h1 className="text-5xl font-bold pb-4 text-center">
            <span className="text-8xl font-bold pb-4 text-center text-lightGreen">
              Flow
            </span>{" "}
            Fungible Tokens
          </h1>
          <Badge
            borderRadius="full"
            px="2"
            variant="outline"
            colorScheme="green"
            className="text-3xl font-bold text-center text-lightGreen"
          >
            <Center>{networkType}</Center>
          </Badge>
          <Box p="120px">
            <div className=" flex flex-col justify-center items-center text-gWhite">
              <Link
                href={`/${networkType.toLocaleLowerCase()}/createFlowFT/createTokenVault`}
              >
                <Button
                  height="48px"
                  width="170px"
                  size="lg"
                  className="rounded-xl text-gWhite bg-lightGreen font-bold hover:bg-lightGreen/60"
                >
                  Create Token Vault
                </Button>
              </Link>
              <Box p={6}></Box>
              <h1 className="text-3xl font-bold pb-4 text-center text-lightGreen">
                Create Fungible Token
              </h1>
              <Link
                href={`/${networkType.toLocaleLowerCase()}/createFlowFT/form`}
              >
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
                <Link href={`/${networkType.toLocaleLowerCase()}`}>
                  <Button
                    height="40px"
                    width="110px"
                    size="lg"
                    className="rounded-xl text-sm text-gWhite bg-lightGreen font-bold hover:bg-lightGreen/60"
                  >
                    Go Back
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
