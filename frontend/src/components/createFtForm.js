"use client";

import * as contractTemplates from "../../../backend/FungibleTokens/templates/contractTemplates";
import "../../flow/config";
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import {
  Button,
  ButtonGroup,
  Box,
  Text,
  Input,
  Checkbox,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Center,
  useToast,
} from "@chakra-ui/react";
import { useTx, IDLE } from "../hooks/use-tx.hook";

export default function CreateFtForm({ onClose }) {
  const toast = useToast();

  const [user, setUser] = useState({ loggedIn: null });
  const [isTotalSupplyChecked, setIsTotalSupplyChecked] = useState(true);
  const [tokenName, setTokenName] = useState("");
  const [totalSupply, setTotalSupply] = useState(0);
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

  const createToken = async () => {
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

    const tokenContract =
      contractTemplates.customTokenContractWithoutTotalSupply(
        { name: tokenName },
        "0x9a0766d93b6608b7"
      );

    try {
      setTransactionPending(true);

      const txId = await exec([
        fcl.arg(tokenName, t.String),
        fcl.arg(Buffer.from(tokenContract, "utf-8").toString("hex"), t.String),
      ]);

      fcl.tx(txId).subscribe(async (res) => {
        console.log(res);
        if (res.status === 4) {
          console.log("EXECUTED");
          setTransactionPending(false);
          createToast(
            "TX Status",
            "Token Was Created Successfuly",
            "success",
            9000
          );
          // onClose();
          window.open(
            `https://testnet.flowscan.org/transaction/${txId}/script`,
            "_blank"
          );
        }
      });
    } catch (e) {
      console.log(e);
      setTransactionPending(false);

      return createToast("Error", "Please Try Again", "error", 3000);
    }
  };

  const handleCloseClick = () => {
    // Close the form
    onClose();
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
    <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 bg-gray-500 z-50">
      <div className="bg-gWhite rounded-lg ">
        <div className="popupContainer">
          <div className="popupForm">
            <Text className="text-lg font-bold text-center" paddingY="10">
              Create Your Own Fungible Token on the Flow Blockchain
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
              <Checkbox
                defaultChecked
                size="lg"
                colorScheme="green"
                spacing="1rem"
                onChange={(e) => setIsTotalSupplyChecked(e.target.checked)}
              >
                Total Cap Supply
              </Checkbox>
              <FormControl>
                <FormLabel>Total Supply</FormLabel>
                {!isTotalSupplyChecked ? (
                  <NumberInput focusBorderColor="lime" value={0} isDisabled>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                ) : (
                  <NumberInput
                    focusBorderColor="lime"
                    defaultValue={1}
                    min={1}
                    onChange={(event) => setTotalSupply(event)}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                )}
              </FormControl>
            </Box>
            <div>
              <ButtonGroup spacing="80" paddingTop="15px">
                <Button
                  height="48px"
                  width="150px"
                  size="lg"
                  isLoading={transactionPending}
                  loadingText={"PENDING"}
                  className="rounded-xl text-gWhite bg-lightGreen font-bold "
                  onClick={createToken}
                >
                  Create Token
                </Button>
                <Button
                  height="48px"
                  width="150px"
                  size="lg"
                  className="rounded-xl text-gWhite bg-lightGreen font-bold hover:bg-lightGreen/60"
                  onClick={handleCloseClick}
                >
                  Close
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
