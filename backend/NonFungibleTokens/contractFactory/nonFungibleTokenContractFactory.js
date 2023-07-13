/* 
Here is The Contract Factory function 

Using this Function I can create custom NonFungible Tokens Contracts on the flow testnet and mainnet
*/

import * as templates from "../templates/contractTemplates";

const NonFungibleTokenMainnet = "0x1d7e57aa55817448"; // Deployed Funglible Token Standard on Mainnet
const NonFungibleTokenTestnet = "0x631e88ae7f1d7c20"; // Deployed Funglible Token Standard on Testnet

const MetadataViewsMainnet = "0x1d7e57aa55817448"; // Deployed Metadata Views Standard on Mainnet
const MetadataViewsTestnet = "0x631e88ae7f1d7c20"; // Deployed Metadata Views Standard on Testnet

export const nftContractFactory = (
  collectionContractName,
  collectionMetadata,
  networkType,
  collectionMetadataDetails = {
    collectionNameMetadata: "",
    collectionDescriptionMetadata: "",
    collectionExternalUrlMetadata: "",
    collectionImageIPFSUrlMetadata: "",
    collectionSocialsMetadata: [],
  }
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

  // Choose the apropriate contract template based on the initialMint option
  let contractTemplate = "";

  if (collectionMetadata) {
    contractTemplate = templates.customNFTCollectionContractWithMetadata(
      collectionContractName,
      nonFungibleTokenStandardAddress,
      metadataViewStandardAddress,
      collectionMetadataDetails
    );
  } else {
    contractTemplate = templates.customNFTCollectionContractWithoutMetadata(
      collectionContractName,
      nonFungibleTokenStandardAddress,
      metadataViewStandardAddress
    );
  }
  return contractTemplate;
};
