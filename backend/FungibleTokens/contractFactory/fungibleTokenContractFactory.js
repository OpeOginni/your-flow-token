import * as templates from "../templates/contractTemplates";

const FungibleTokenMainnet = "0xf233dcee88fe0abe";
const FungibleTokenTestnet = "0x9a0766d93b6608b7";

export const ftContractTemplateFactory = (
  tokenName,
  initialMint,
  networkType
) => {
  let fungibleTokenStandardAddress = "";

  // Set the fungibleTokenStandardAddress based on the networkType
  if (networkType === "TESTNET") {
    fungibleTokenStandardAddress = FungibleTokenTestnet;
  } else if (networkType === "MAINNET") {
    fungibleTokenStandardAddress = FungibleTokenMainnet;
  }

  // Choose the appropriate contract template based on the initialMint option
  let contractTemplate = "";
  if (initialMint) {
    contractTemplate = templates.customTokenContractWithInitialMint(
      tokenName,
      fungibleTokenStandardAddress,
      initialMint
    );
  } else {
    contractTemplate = templates.customTokenContractWithoutInitialMint(
      tokenName,
      fungibleTokenStandardAddress
    );
  }

  return contractTemplate;
};
