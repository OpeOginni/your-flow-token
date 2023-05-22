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
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-500 bg-opacity-50">
      <div className=" flex flex-col justify-center items-center text-gWhite rounded-lg">
        <Text>Create Your Own Fungible Token on the Flow Blockchain</Text>
        <Input variant="filled" placeholder="Token Name" />
        <Text>Token Details</Text>
        <Box>
          <Checkbox
            defaultChecked
            onClick={() => setIsTotalSupplyChecked(true)}
          >
            Total Cap Supply
          </Checkbox>
          <FormControl>
            <FormLabel>Total Supply</FormLabel>
            {isTotalSupplyChecked ? (
              <NumberInput defaultValue={0} isDisabled>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            ) : (
              <NumberInput>
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
          <button onClick={handleCloseClick}>Close</button>
        </div>
      </div>
    </div>
  );
}
