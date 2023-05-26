import "../../flow/config";
const axios = require("axios");
import * as fcl from "@onflow/fcl";
import * as scriptTemplates from "../../../backend/FungibleTokens/templates/scriptTemplates";
import { useToast } from "@chakra-ui/react";

// TODO: Find better way to check if a contract is a token or not
export const fetchAccountContracts = async () => {
  fcl.currentUser.subscribe(async (user) => {
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

    try {
      console.group(user);
      const accountContractsArray1 = await fcl.query({
        cadence: scriptTemplates.getAccountContracts(),
        args: (arg, t) => [arg(user.addr, t.Address)],
      });

      console.log(accountContractsArray1);
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
      console.log(accountContractsArray2);

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
      console.log(newData);

      return newData;
    } catch (err) {
      return console.log(err);
    }
  });
};
