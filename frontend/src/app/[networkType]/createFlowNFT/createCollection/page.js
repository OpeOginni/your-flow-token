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
import { usePathname } from "next/navigation";
import { flowConfig } from "../../../../utils/flowConfig.util";
import { nftContractFactory } from "../../../../../../backend/NonFungibleTokens/contractFactory/nonFungibleTokenContractFactory";

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
  const [collectionName, setCollectionName] = useState("");
  const [initialMint, setInitialMint] = useState(0);
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

  const [exec, status, txStatus, details] = useTx([
    fcl.transaction`
    transaction(name: String, code: String) {
      prepare(acct: AuthAccount) {
        acct.contracts.add(name: name, code: code.decodeHex())
      }
    }
    `,
    fcl.payer(fcl.authz),
    fcl.proposer(fcl.authz),
    fcl.authorizations([fcl.authz]),
    fcl.limit(1000),
  ]);

  const createNFTCollection = async () => {
    if (/\s/.test(collectionName) || collectionName.length < 1) {
      console.log(collectionName);
      return toast({
        title: "Error",
        description: "Collection name should not contain spaces or be empty",
        status: "error",
        position: "bottom-right",
        duration: 4000,
        isClosable: true,
      });
    }

    const collectionContract = nftContractFactory(
      collectionName,
      false,
      networkType
    );

    console.log(collectionContract);

    try {
      setTransactionPending(true);

      const txId = await exec([
        fcl.arg(collectionName, t.String),
        fcl.arg(
          Buffer.from(collectionContract, "utf-8").toString("hex"),
          t.String
        ),
      ]);

      fcl.tx(txId).subscribe(async (res) => {
        console.log(res);
        if (res.errorMessage) {
          setTransactionPending(false);
          return createToast(
            "TX Status",
            "Error in Creating Collection",
            "error",
            9000
          );
        }
        if (res.status === 4) {
          console.log("EXECUTED");
          setTransactionPending(false);
          createToast(
            "TX Status",
            "NFT Collection Was Created Successfuly",
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
              Create Your Own NFT Collection on the Flow Blockchain
            </Text>
            <Box paddingY="10px">
              <Input
                focusBorderColor="lime"
                placeholder="Collection Name"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
              />
            </Box>
            <div>
              <ButtonGroup spacing="80" paddingTop="15px">
                <Link
                  href={`/${networkType.toLocaleLowerCase()}/createFlowNFT`}
                >
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
                  onClick={createNFTCollection}
                >
                  Create Collection
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
