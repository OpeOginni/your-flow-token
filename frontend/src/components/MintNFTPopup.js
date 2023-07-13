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
  useToast,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { uploadToIPFS } from "../utils/IPFSUpload";
import {
  NFTIsCollection,
  nftMintTransactionFactory,
} from "../../../backend/NonFungibleTokens/transactionFactory/createNFTFactory";
import { useTx } from "../hooks/use-tx.hook";

function MintNFTPopup({
  isOpen,
  onClose,
  collection,
  minterWallet,
  networkType,
}) {
  const [metadata, setMetadata] = useState([{ key: "", value: "" }]);
  const [NFTName, setNFTName] = useState("");
  const [NFTDescription, setNFTDescription] = useState("");
  const [deployedIPFSLink, setDeployedIPFSLink] = useState("");
  const [image, setImage] = useState("");
  const [NFTReciever, setNFTReciever] = useState("");
  const [transactionPending, setTransactionPending] = useState(false);

  const toast = useToast();

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

  const flowScanExplorer = (_networkType, _contractId) => {
    if (_networkType === "MAINNET") {
      return `https://flowscan.org/contract/${_contractId}`;
    } else if (_networkType === "TESTNET") {
      return `https://testnet.flowscan.org/contract/${_contractId}`;
    }
  };

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

  const mintNFT = async () => {
    try {
      const ipfsLink = await uploadToIPFS(image, NFTName, NFTDescription);
      console.log("Name: ", NFTName);
      console.log("Description: ", NFTDescription);
      console.log("Metadata: ", metadata);
      console.log("ipfsLink: ", ipfsLink);

      const checkIfCollection = NFTIsCollection(
        collection.name,
        minterWallet,
        networkType
      );

      console.log(checkIfCollection);

      const isCollection = await fcl.query({
        cadence: checkIfCollection,
        args: (arg, t) => [arg(NFTReciever, t.Address)],
      });

      if (!isCollection) {
        setTransactionPending(false);
        return createToast(
          "Error",
          "Reciever Doesn't have a Collection",
          "error",
          5000
        );
      }

      const mintNFTTransactionCode = nftMintTransactionFactory(
        collection.name,
        minterWallet,
        networkType
      );

      console.log(mintNFTTransactionCode);

      const [exec, status, txStatus, details] = useTx([
        fcl.transaction`${mintNFTTransactionCode}`,
        fcl.payer(fcl.authz),
        fcl.proposer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.limit(1000),
      ]);

      setTransactionPending(true);
      console.log("IPFS", ipfsLink.data.image.href);

      const txId = await exec([
        fcl.arg(NFTReciever, t.Address),
        fcl.arg(NFTName, t.String),
        fcl.arg(NFTDescription, t.String),
        fcl.arg(ipfsLink.data.image.href, t.String),
        fcl.arg(metadata, t.Dictionary({ key: t.String, value: t.String })),
      ]);

      fcl.tx(txId).subscribe(async (res) => {
        console.log(res);
        if (res.errorMessage) {
          setTransactionPending(false);
          return createToast(
            "Error in Minting NFT",
            "Check the Reciever Address",
            "error",
            9000
          );
        }
        if (res.status === 4) {
          console.log("EXECUTED");
          setTransactionPending(false);
          createToast(
            "TX Status",
            "NFT Was Minted Successfuly",
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

      return createToast("TX Status", "Error in Creating NFT", "error", 9000);
    }
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
          <FormControl>
            <FormLabel>Reciever Address</FormLabel>
            <Input
              placeholder="0x0..."
              value={NFTReciever}
              onChange={(e) => setNFTReciever(e.target.value)}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Image</FormLabel>
            <Input
              type="file"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
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
            isLoading={transactionPending}
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
