import "../../flow/config";
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
} from "@chakra-ui/react";

import * as fcl from "@onflow/fcl";
import * as scriptTemplates from "../../../backend/FungibleTokens/templates/scriptTemplates";
import Link from "next/link";

const UserTokensList = ({ user }) => {
  const toast = useToast();
  const [combinedData, setCombinedData] = useState(null);
  const [_combinedData, _setCombinedData] = useState(null);

  useEffect(() => {
    const fetchAccountContracts = async () => {
      const wallet = await user;
      try {
        console.log(wallet);
        const accountContractsArray1 = await fcl.query({
          cadence: scriptTemplates.getAccountContracts(),
          args: (arg, t) => [arg(wallet.addr, t.Address)],
        });

        const newData = accountContractsArray1
          .map((firstObj, index) => {
            const { contractName, contractAddress, contractType } = firstObj;

            return {
              id: `A.${contractAddress}.${contractName}`,
              _id: index,
              type: contractType.kind,
              name: contractName,
            };
          })
          .filter(Boolean);
        setCombinedData(newData);

        console.log(newData);
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
    <Box background="black" className="flex flex-col  text-gWhite">
      <h1 className="text-3xl font-bold pb-4 text-center">Your Tokens</h1>
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
                <Text colSpan={2}>{contract.name}</Text>
              </GridItem>

              <GridItem colSpan={2}>
                <Badge borderRadius="full" px="2" colorScheme="teal">
                  {contract.type}
                </Badge>{" "}
              </GridItem>

              <GridItem colSpan={2}>
                <Link
                  href={`https://testnet.flowscan.org/contract/${contract.id}`}
                  target="_blank"
                >
                  <Text as="u">Check Token on FlowScan</Text>{" "}
                </Link>
              </GridItem>

              <GridItem colSpan={2}>
                <Link
                  href={`https://testnet.flowscan.org/contract/${contract.id}`}
                  target="_blank"
                >
                  <Text borderRadius="full" px="2" colorScheme="teal">
                    Interact on Flex-My-Flow-Token
                  </Text>{" "}
                </Link>
              </GridItem>
            </Grid>
          ))
        ) : (
          <Center>
            <Text className="text-bold text-lightGreen">
              You Have No Tokens
            </Text>
          </Center>
        )}
      </div>
    </Box>
  );
};

export default UserTokensList;
