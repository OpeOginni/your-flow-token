import * as templates from "../templates/transactionTemplates";

const NonFungibleTokenMainnet = "0xf233dcee88fe0abe"; // Deployed Funglible Token Standard on Mainnet
const NonFungibleTokenTestnet = "0x9a0766d93b6608b7"; // Deployed Funglible Token Standard on Testnet

export const NFTIsCollection = (
  collectionName,
  collectionAddress,
  networkType
) => {
  let nonFungibleTokenStandardAddress = "";

  // Set the fungibleTokenStandardAddress based on the networkType
  if (networkType === "TESTNET") {
    nonFungibleTokenStandardAddress = NonFungibleTokenTestnet;
  } else if (networkType === "MAINNET") {
    nonFungibleTokenStandardAddress = NonFungibleTokenMainnet;
  }

  // Choose the appropriate contract template based on the initialMint option
  let contractTemplate = "";

  contractTemplate = templates.isNFTCollection(
    collectionName,
    collectionAddress,
    nonFungibleTokenStandardAddress
  );

  return contractTemplate;
};
