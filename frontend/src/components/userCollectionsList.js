import { useEffect, useState } from "react";
import {
  Badge,
  Grid,
  Box,
  Text,
  useToast,
  GridItem,
  Center,
  Spinner,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";

import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import * as scriptTemplates from "../../../backend/FungibleTokens/templates/scriptTemplates";
import Link from "next/link";
import { useTx } from "../hooks/use-tx.hook";
import { usePathname } from "next/navigation";
import { flowConfig } from "../utils/flowConfig.util.js";
import { NFTIsCollection } from "../../../backend/NonFungibleTokens/transactionFactory/createNFTFactory";
import MintNFTPopup from "./MintNFTPopup";

const UserNFTCollectionList = ({ user }) => {
  // Get the PathName to know which Network the User is On
  const pathName = usePathname();
  const networkType = pathName.split("/")[1].toLocaleUpperCase();

  // Use the Flow Config settings of the specific network the user is on
  flowConfig(networkType);

  const flowScanExplorer = (_networkType, _contractId) => {
    if (_networkType === "MAINNET") {
      return `https://flowscan.org/contract/${_contractId}`;
    } else if (_networkType === "TESTNET") {
      return `https://testnet.flowscan.org/contract/${_contractId}`;
    }
  };

  const flowViewLink = (_networkType, _userAddress) => {
    if (_networkType === "MAINNET") {
      return `https://www.flowview.app/account/${_userAddress}/fungible_token`;
    } else if (_networkType === "TESTNET") {
      return `https://testnet.flowview.app/account/${_userAddress}/fungible_token`;
    }
  };

  const toast = useToast();
  const [combinedData, setCombinedData] = useState(null);
  const [_combinedData, _setCombinedData] = useState(null);
  const [userFlowViewLink, setUserFlowViewLink] = useState("");
  const [mintData, setMintData] = useState({});
  const [transactionPending, setTransactionPending] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
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

  const mintNFT = async (collection) => {
    const wallet = await user;

    try {
      const checkIfCollection = NFTIsCollection(
        collection.name,
        wallet.addr,
        networkType
      );

      console.log(checkIfCollection);

      const isCollection = await fcl.query({
        cadence: checkIfCollection,
        args: (arg, t) => [arg(wallet.addr, t.Address)],
      });

      if (!isCollection) {
        setTransactionPending(false);
        return createToast("Error", "No NFT Collection Exists", "error", 5000);
      } else {
        createToast("Success", "Collection Exists", "success", 2000);

        handleOpenPopup();
      }
    } catch (e) {
      setTransactionPending(false);
      return createToast("Can't Mint", "Not a Collection", "error", 3000);
    }
  };

  useEffect(() => {
    const fetchAccountContracts = async () => {
      const wallet = await user;
      try {
        setUserFlowViewLink(flowViewLink(networkType, wallet.addr));
        console.log(wallet);
        const accountContractsArray1 = await fcl.query({
          cadence: scriptTemplates.getAccountContracts(),
          args: (arg, t) => [arg(wallet.addr, t.Address)],
        });

        const newData = accountContractsArray1
          .map((firstObj, index) => {
            const { contractName, contractAddress, contractType } = firstObj;
            let contractAddressWithoutOx;
            if (contractAddress) {
              contractAddressWithoutOx = contractAddress.replace("0x", "");
            }
            return {
              id: `A.${contractAddressWithoutOx}.${contractName}`,
              _id: index,
              type: contractType.kind,
              name: contractName,
            };
          })
          .filter(Boolean);
        setCombinedData(newData);

        console.log(newData);
        newData.map((contract) => {
          setMintData((prevData) => ({
            ...prevData,
            [contract.name]: { receiverAddress: "", amount: 1 },
          }));
        });
      } catch (err) {
        console.log(err);
        return toast({
          title: "Error",
          description: "Network Error",
          status: "error",
          position: "bottom-right",
          duration: 4000,
          isClosable: true,
        });
      }
    };
    console.log("FETING");
    fetchAccountContracts();
  }, [user, toast]);

  return (
    <>
      <Box background="black" className="flex flex-col  text-gWhite">
        <h1 className="text-3xl font-bold pb-4 text-center">
          Your Deployed Contracts
        </h1>
        <h1 className="text-xl  pb-4 text-center">
          Mint from NFT Collections ONLY
          <Badge borderRadius="full" px="2" colorScheme="green">
            <Link href={userFlowViewLink} target="_blank" className="font-bold">
              FlowView
            </Link>
          </Badge>
        </h1>

        <div className="flex flex-col">
          {combinedData == null ? (
            <Grid padding="5" templateColumns="repeat(8, 1fr)" gap={6}>
              <GridItem colSpan={2}>
                <Center>
                  <Spinner />
                </Center>{" "}
              </GridItem>

              <GridItem colSpan={2}>
                <Center>
                  <Spinner />
                </Center>
              </GridItem>

              <GridItem colSpan={2}>
                <Center>
                  <Spinner />
                </Center>
              </GridItem>

              <GridItem colSpan={2}>
                <Center>
                  <Spinner />
                </Center>
              </GridItem>
            </Grid>
          ) : combinedData.length > 0 ? (
            combinedData.map((contract) => (
              <Grid
                padding="5"
                key={contract._id}
                templateColumns="repeat(8, 1fr)"
                gap={6}
              >
                <GridItem colSpan={2}>
                  <Text className="text-lg" as="b" colSpan={2}>
                    {contract.name}
                  </Text>
                </GridItem>

                <GridItem colSpan={2}>
                  <Badge borderRadius="full" px="2" colorScheme="teal">
                    {contract.type}
                  </Badge>{" "}
                </GridItem>

                <GridItem colSpan={2}>
                  <Link
                    href={flowScanExplorer(networkType, contract.id)}
                    target="_blank"
                  >
                    <Text as="u">Check Token on FlowScan</Text>{" "}
                  </Link>
                </GridItem>

                <GridItem colSpan={2}>
                  <ButtonGroup gap={2}>
                    <Button
                      height="40px"
                      width="110px"
                      size="lg"
                      isLoading={transactionPending}
                      loadingText={"..."}
                      className="rounded-xl text-gWhite bg-lightGreen font-bold hover:bg-lightGreen/60"
                      onClick={() => {
                        mintNFT(contract);
                      }}
                    >
                      Check
                    </Button>
                    <Button
                      height="40px"
                      width="110px"
                      size="lg"
                      isLoading={transactionPending}
                      loadingText={"..."}
                      className="rounded-xl text-gWhite bg-lightGreen font-bold hover:bg-lightGreen/60"
                      onClick={() => {
                        mintNFT(contract);
                      }}
                    >
                      Mint
                    </Button>
                  </ButtonGroup>
                </GridItem>
              </Grid>
            ))
          ) : (
            <Center>
              <Text className="text-bold text-lightGreen">
                You Have No Contracts
              </Text>
            </Center>
          )}
        </div>
      </Box>
      <MintNFTPopup isOpen={isPopupOpen} onClose={handleClosePopup} />
    </>
  );
};

export default UserNFTCollectionList;
