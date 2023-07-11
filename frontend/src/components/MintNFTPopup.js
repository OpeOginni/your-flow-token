"use client";

import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  IconButton,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";

function MintNFTPopup({ isOpen, onClose }) {
  const [metadata, setMetadata] = useState([{ key: "", value: "" }]);
  const [NFTName, setNFTName] = useState("");
  const [NFTDescription, setNFTDescription] = useState("");
  const [deployedIPFSLink, setDeployedIPFSLink] = useState("");

  const handleAddMetadata = () => {
    setMetadata([...metadata, { key: "", value: "" }]);
  };

  const handleRemoveMetadata = (index) => {
    const updatedMetadata = [...metadata];
    updatedMetadata.splice(index, 1);
    setMetadata(updatedMetadata);
  };

  const handleMetadataChange = (index, field, value) => {
    const updatedMetadata = [...metadata];
    updatedMetadata[index][field] = value;
    setMetadata(updatedMetadata);
  };

  const mintNFT = () => {
    console.log("Name: ", NFTName);
    console.log("Description: ", NFTDescription);
    console.log("Metadata: ", metadata);
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create NFT</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>NFT Name</FormLabel>
            <Input
              focusBorderColor="lime"
              placeholder="Coolio Rulio"
              value={NFTName}
              onChange={(e) => setNFTName(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>NFT Description</FormLabel>
            <Input
              placeholder="Anything You decide...."
              value={NFTDescription}
              onChange={(e) => setNFTDescription(e.target.value)}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Image</FormLabel>
            <Input type="file" />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Metadata</FormLabel>

            {metadata.map((item, index) => (
              <Box key={index} display="flex" marginBottom="1rem">
                <Input
                  placeholder="Key"
                  value={item.key}
                  onChange={(e) =>
                    handleMetadataChange(index, "key", e.target.value)
                  }
                  marginRight="1rem"
                />
                <Input
                  placeholder="Value"
                  value={item.value}
                  onChange={(e) =>
                    handleMetadataChange(index, "value", e.target.value)
                  }
                />

                <IconButton
                  icon={<MinusIcon />}
                  aria-label="Remove Metadata"
                  onClick={() => handleRemoveMetadata(index)}
                  marginLeft="1rem"
                />
              </Box>
            ))}
          </FormControl>

          <IconButton
            icon={<AddIcon />}
            aria-label="Add Metadata"
            onClick={handleAddMetadata}
          />
        </ModalBody>

        <ModalFooter>
          <Button
            loadingText={"..."}
            className="rounded-xl text-gWhite bg-lightGreen font-bold hover:bg-lightGreen/60"
            mr={3}
            onClick={mintNFT}
          >
            Mint
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default MintNFTPopup;
