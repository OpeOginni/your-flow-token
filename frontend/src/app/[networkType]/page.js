"use client";

import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import {
  SimpleGrid,
  Button,
  useToast,
  Text,
  Badge,
  Center,
  Box,
} from "@chakra-ui/react";
import Link from "next/link.js";
import { usePathname } from "next/navigation";
import { flowConfig } from "../../utils/flowConfig.util";

export default function NetworkTypeHomePage() {
  const [user, setUser] = useState({ loggedIn: null });

  // Get the PathName to know which Network the User is On
  const pathName = usePathname();
  const networkType = pathName.split("/")[1].toLocaleUpperCase();

  // Use the Flow Config settings of the specific network the user is on
  flowConfig(networkType);

  useEffect(() => {
    fcl.currentUser.subscribe(setUser);
  }, []);

  const toast = useToast();

  const comingSoonToast = () => {
    toast({
      title: "NFT Creation Coming Soon",
      description: "Keep Your Eyes Peeled.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  return (
    <div className="flex flex-col justify-center items-center text-gWhite ">
      <h1 className="text-5xl font-bold pb-4 text-center">
        Your{" "}
        <span className="text-8xl font-bold pb-4 text-center text-lightGreen">
          Flow
        </span>{" "}
        Token
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
      {user.loggedIn ? (
        <SimpleGrid columns={2} spacingX="80px" p="120px">
          <div className=" flex flex-col justify-center items-center text-gWhite">
            <h1 className="text-3xl font-bold pb-4 text-center text-lightGreen">
              Create Fungible Token
            </h1>
            <Link href={`/${networkType.toLocaleLowerCase()}/createFlowFT`}>
              <Button
                height="48px"
                width="150px"
                size="lg"
                className="rounded-xl text-gWhite bg-lightGreen font-bold hover:bg-lightGreen/60"
              >
                Fungible Tokens
              </Button>
            </Link>
          </div>
          <div className=" flex flex-col justify-center items-center text-gWhite">
            <h1 className="text-3xl font-bold pb-4 text-center text-lightGreen">
              Create Non-Fungible Token (NFT)
            </h1>
            <Button
              height="48px"
              width="150px"
              size="lg"
              className="rounded-xl text-gWhite bg-lightGreen font-bold hover:bg-lightGreen/60"
              onClick={comingSoonToast}
            >
              Coming Soon!
            </Button>
          </div>
        </SimpleGrid>
      ) : (
        <Box p="120px">
          <Center>
            <Text> Go on...Connect Your Wallet 😉</Text>
          </Center>
          <Center>
            <Text>See what flow has to offer</Text>
          </Center>
        </Box>
      )}
      <Center>
        <Link href="/">
          <Button
            height="48px"
            width="150px"
            size="lg"
            className="rounded-xl text-gWhite bg-lightGreen font-bold hover:bg-lightGreen/60"
          >
            Back to Home
          </Button>
        </Link>
      </Center>
    </div>
  );
}
