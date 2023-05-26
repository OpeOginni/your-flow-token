import "../../flow/config";
const axios = require("axios");
import { useEffect, useState } from "react";
import { Badge, Grid, Box, Text, Center, GridItem } from "@chakra-ui/react";

import * as fcl from "@onflow/fcl";
import * as scriptTemplates from "../../../backend/FungibleTokens/templates/scriptTemplates";
import Link from "next/link";
import { fetchAccountContracts } from "@/fetches/fetchAccountContracts";
import LoadingUserTokensList from "./loadingUserTokens";

const UserTokensList = async () => {
  const [isFetchingContract, setIsFetcingContract] = useState(true);
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const fetchedContracts = await fetchAccountContracts();
        setContracts(fetchedContracts);
      } catch (err) {
        toast({
          title: "Error",
          description: "Network Error",
          status: "error",
          position: "bottom-right",
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setIsFetcingContract(false);
      }
    };

    fetchContracts();
  }, []);

  if (isFetchingContract) {
    return <LoadingUserTokensList />;
  }
  if (contracts.length == 0) {
    <div className="flex flex-col">
      <Center>
        <Text>You Have No Tokens Deployed</Text>
      </Center>
    </div>;
  }
  return (
    <div className="flex flex-col">
      {contracts.map((contract) => (
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
  );
};

export default UserTokensList;
