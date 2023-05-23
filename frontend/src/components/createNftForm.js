"use client";

import "../../flow/config";
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
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
  theme,
} from "@chakra-ui/react";
import { useTx, IDLE } from "../hooks/use-tx.hook";

export default function CreateFtForm({ onClose }) {
  const [user, setUser] = useState({ loggedIn: null });
  const [isTotalSupplyChecked, setIsTotalSupplyChecked] = useState(true);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here

    // Close the form
    onClose();
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
                className="border-2 border-lightGreen rounded-lg h-8"
                placeholder="Token Name"
              />
            </Box>
            <Box paddingY="10px">
              <Checkbox
                className="border-2 border-lightGreen rounded-lg"
                defaultChecked
                size="lg"
                colorScheme="lime"
                spacing="1rem"
                onChange={(e) => setIsTotalSupplyChecked(e.target.checked)}
              >
                Total Cap Supply
              </Checkbox>
              <FormControl>
                <FormLabel>Total Supply</FormLabel>
                {!isTotalSupplyChecked ? (
                  <NumberInput
                    className="border-2 border-lightGreen rounded-lg h-10 text-xl"
                    value={0}
                    isDisabled
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                ) : (
                  <NumberInput
                    className="border-2 border-lightGreen rounded-lg h-auto "
                    defaultValue={0}
                    min={0}
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
                  className="rounded-xl text-gWhite bg-lightGreen font-bold hover:bg-lightGreen/60"
                  onClick={handleCloseClick}
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
