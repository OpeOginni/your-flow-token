import * as templates from "../templates/transactionTemplates";

const NonFungibleTokenMainnet = "0x1d7e57aa55817448"; // Deployed Funglible Token Standard on Mainnet
const NonFungibleTokenTestnet = "0x631e88ae7f1d7c20"; // Deployed Funglible Token Standard on Testnet

const MetadataViewsMainnet = "0x1d7e57aa55817448"; // Deployed Metadata Views Standard on Mainnet
const MetadataViewsTestnet = "0x631e88ae7f1d7c20"; // Deployed Metadata Views Standard on Testnet
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

export const nftMintTransactionFactory = (
  collectionName,
  collectionAddress,
  networkType
) => {
  let nonFungibleTokenStandardAddress = "";
  let metadataViewStandardAddress = "";

  // Set the fungibleTokenStandardAddress based on the networkType

  if (networkType === "TESTNET") {
    nonFungibleTokenStandardAddress = NonFungibleTokenTestnet;
    metadataViewStandardAddress = MetadataViewsTestnet;
  } else if (networkType === "MAINNET") {
    nonFungibleTokenStandardAddress = NonFungibleTokenMainnet;
    metadataViewStandardAddress = MetadataViewsMainnet;
  }

  let contractTemplate = "";

  contractTemplate = templates.mintNFT(
    collectionName,
    collectionAddress,
    nonFungibleTokenStandardAddress,
    metadataViewStandardAddress
  );

  return contractTemplate;
};
