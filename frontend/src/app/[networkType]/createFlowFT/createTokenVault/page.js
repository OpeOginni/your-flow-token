"use client";

import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import {
  Button,
  ButtonGroup,
  Box,
  Text,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useTx } from "../../../../hooks/use-tx.hook";
import Link from "next/link";
import {
  ftCreateTokenVault,
  ftHasTokenVault,
} from "../../../../../../backend/FungibleTokens/transactionFactory/createTokenVaultFactory";
import { usePathname } from "next/navigation";
import { flowConfig } from "../../../../utils/flowConfig.util";

export default function CreateFtForm({ onClose }) {
  const toast = useToast();
  // Get the PathName to know which Network the User is On
  const pathName = usePathname();
  const networkType = pathName.split("/")[1].toLocaleUpperCase();

  // Use the Flow Config settings of the specific network the user is on
  flowConfig(networkType);

  const flowScanExplorer = (_networkType, _txId) => {
    if (_networkType === "MAINNET") {
      return `https://flowscan.org/transaction/${_txId}`;
    } else if (_networkType === "TESTNET") {
      return `https://testnet.flowscan.org/transaction/${_txId}`;
    }
  };

  const getUser = () => {
    return new Promise((resolve, reject) => {
      fcl.currentUser().subscribe(resolve, reject);
    });
  };

  const [user, setUser] = useState({ loggedIn: null });
  const [IsInitialMintChecked, setIsInitialMintChecked] = useState(true);
  const [tokenName, setTokenName] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [transactionPending, setTransactionPending] = useState(false);

  const createToast = (title, description, status, duration) => {
    return toast({
      title: title,
      description: description,
      status: status,
      position: "bottom-right",
      duration: duration,
      isClosable: true,
    });
  };

  const createVault = async () => {
    if (/\s/.test(tokenName)) {
      console.log(tokenName);
      return toast({
        title: "Error",
        description: "Token name should not contain spaces",
        status: "error",
        position: "bottom-right",
        duration: 4000,
        isClosable: true,
      });
    }

    try {
      const checkTokenVault = ftHasTokenVault(
        tokenName,
        tokenAddress,
        networkType
      );

      const hasTokenVault = await fcl.query({
        cadence: checkTokenVault,
        args: (arg, t) => [arg(user.addr, t.Address)],
      });

      if (hasTokenVault) {
        setTransactionPending(false);
        return createToast(
          "Error",
          "You already have a vault for this token",
          "error",
          3000
        );
      }
    } catch {
      console.log(e);
      setTransactionPending(false);

      return createToast("Error", "Please Try Again", "error", 3000);
    }

    const createVaultTranaction = ftCreateTokenVault(
      tokenName,
      tokenAddress,
      networkType
    );

    const [exec, status, txStatus, details] = useTx([
      fcl.transaction`${createVaultTranaction}`,
      fcl.payer(fcl.authz),
      fcl.proposer(fcl.authz),
      fcl.authorizations([fcl.authz]),
      fcl.limit(1000),
    ]);

    try {
      setTransactionPending(true);

      const txId = await exec();

      fcl.tx(txId).subscribe(async (res) => {
        console.log(res);
        if (res.errorMessage) {
          setTransactionPending(false);
          return createToast(
            "TX Status",
            "Error in Creating Token Vault",
            "error",
            9000
          );
        }
        if (res.status === 4) {
          console.log("EXECUTED");
          setTransactionPending(false);
          createToast(
            "TX Status",
            "Token Vault Created Successfuly",
            "success",
            9000
          );

          // SHows Transaction Page in 4 seconds
          setTimeout(function () {
            window.open(flowScanExplorer(networkType, txId), "_blank");
          }, 4000);
        }
      });
    } catch (e) {
      console.log(e);
      setTransactionPending(false);

      return createToast("Error", "Please Try Again", "error", 3000);
    }
  };

  useEffect(() => {
    fcl.currentUser.subscribe(setUser);
    return () => {
      // Cleanup function
      // This code will run before the component is unmounted or `fcl.currentUser.subscribe` needs to be cleaned up
      // Perform any necessary cleanup or cancel any ongoing tasks here
    };
  }, []);

  return (
    <div className=" inset-0 flex justify-center items-center bg-opacity-50 bg-gray-500 z-50">
      <div className="bg-gWhite rounded-lg ">
        <div className="popupContainer">
          <div className="popupForm">
            <Text className="text-lg font-bold text-center" paddingY="10">
              Create A Vault so you can Recieve the Token
            </Text>
            <Text className="text-sm text-center" paddingY="2">
              Get the following details of the token you want to recieve
            </Text>
            <Box paddingY="10px">
              <Input
                focusBorderColor="lime"
                placeholder="Token Name"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
              />
            </Box>
            <Box paddingY="10px">
              <Input
                focusBorderColor="lime"
                placeholder="Token Address"
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
              />
            </Box>

            <div>
              <ButtonGroup spacing="80" paddingTop="15px">
                <Link href={`/${networkType.toLocaleLowerCase()}/createFlowFT`}>
                  <Button
                    height="48px"
                    width="150px"
                    size="lg"
                    className="rounded-xl text-gWhite bg-lightGreen font-bold hover:bg-lightGreen/60"
                  >
                    Close
                  </Button>
                </Link>
                <Button
                  height="48px"
                  width="150px"
                  size="lg"
                  isLoading={transactionPending}
                  loadingText={"PENDING"}
                  className="rounded-xl text-gWhite bg-lightGreen font-bold hover:bg-lightGreen/60"
                  onClick={createVault}
                >
                  Create Vault
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
