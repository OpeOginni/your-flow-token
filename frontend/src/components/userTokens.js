import "../../flow/config";
const axios = require("axios");
import { useEffect, useState } from "react";
import { Badge, Grid, Box, Text, useToast, GridItem } from "@chakra-ui/react";

import * as fcl from "@onflow/fcl";
import * as scriptTemplates from "../../../backend/FungibleTokens/templates/scriptTemplates";
import Link from "next/link";

const UserTokensList = async ({ user }) => {
  const toast = useToast();
  const [combinedData, setCombinedData] = useState([]);

  const token = "5a477c43abe4ded25f1e8cc778a34911134e0590";
  const url = `https://query.testnet.flowgraph.co/?token=${token}`;
  const payload = {
    operationName: "AccountViewerByAddressQuery",
    variables: {
      id: user.addr,
    },
    query: `query AccountViewerByAddressQuery($id: ID!) {
        account(id: $id) {
          ...AccountViewerFragment
          __typename
        }
      }
      
      fragment AccountViewerFragment on Account {
        address
        tokenTransferCount
        nftTransferCount
        transactionCount
        tokenBalanceCount
        ...AccountHeaderFragment
        __typename
      }
      
      fragment AccountHeaderFragment on Account {
        address
        balance
        domainNames {
          fullName
          provider
          __typename
        }
        creation {
          time
          hash
          __typename
        }
        contracts {
          id
          type
          __typename
        }
        __typename
      }`,
  };

  useEffect(() => {
    const fetchAccountContracts = async () => {
      try {
        const accountContractsArray1 = await fcl.query({
          cadence: scriptTemplates.getAccountContracts(),
          args: (arg, t) => [arg(user.addr, t.Address)],
        });

        const accountContractsArray2 = await axios
          .post(url, payload)
          .then((response) => {
            if (response.status === 200) {
              const data = response.data;
              // Process the response data as needed
              const contracts = data.data.account.contracts;

              const tokenContracts = contracts.filter(
                (contract) => contract.type === "FungibleToken"
              );
              return tokenContracts;
            } else {
              throw new Error(
                `API request failed with status code: ${response.status}`
              );
            }
          })
          .catch((error) => {
            console.error("API request failed:", error.message);
          });
        let newData = [];
        let count = 0;

        accountContractsArray1
          .map((firstObj) => {
            const { contractName } = firstObj;

            const matchingSecondObj = accountContractsArray2.find((secondObj) =>
              secondObj.id.includes(contractName)
            );
            if (matchingSecondObj) {
              const { id, type } = matchingSecondObj;
              newData.push({ id, _id: count, type, name: contractName });
              count++;
            }
          })
          .filter(Boolean);
        setCombinedData(newData);

        console.log(newData);
      } catch (err) {
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
    fetchAccountContracts();
  }, [user.addr, toast]);

  return (
    <Box background="black" className="flex flex-col  text-gWhite">
      <h1 className="text-3xl font-bold pb-4 text-center">Your Tokens</h1>
      <div className="flex flex-col">
        {combinedData.map((contract) => (
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
        ))}
      </div>
    </Box>
  );
};

export default UserTokensList;
