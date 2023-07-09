/* 
Here is The Contract Factory function 

Using this Function I can create custom NonFungible Tokens Contracts on the flow testnet and mainnet
*/

import * as templates from "../templates/contractTemplates";

const NonFungibleTokenMainnet = "0xf233dcee88fe0abe"; // Deployed Funglible Token Standard on Mainnet
const NonFungibleTokenTestnet = "0x9a0766d93b6608b7"; // Deployed Funglible Token Standard on Testnet

const MetadataViewsMainnet = "0xf233dcee88fe0abe"; // Deployed Metadata Views Standard on Mainnet
const MetadataViewsTestnet = "0x9a0766d93b6608b7"; // Deployed Metadata Views Standard on Testnet

export const nftContractFactory = (
  collectionContractName,
  collectionMetadata,
  networkType,
  NFTmetadata,
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
      NFTmetadata,
      collectionMetadataDetails
    );
  } else {
    contractTemplate = templates.customNFTCollectionContractWithoutMetadata(
      collectionContractName,
      nonFungibleTokenStandardAddress,
      metadataViewStandardAddress,
      NFTmetadata
    );
  }
  return contractTemplate;
};
