const getTokenBalanceOfAccount = (
  TokenDetails,
  FungibleTokenStandardAddress
) => {
  `
  import ${TokenDetails.name} from ${TokenDetails.contractAddress}
  import FungibleToken from ${FungibleTokenStandardAddress}
  
  pub fun main(account: Address): UFix64 {
      let publicVault = getAccount(account).getCapability(/public/Vault)
          .borrow<&${TokenDetails.name}.Vault{FungibleToken.Balance}>()
          ?? panic("Could not borrow the public Vault.")
      return publicVault.balance
  }
  `;
};

const getTokenTotalSupply = (TokenDetails) => {
  `
  import ${TokenDetails.name} from ${TokenDetails.contractAddress}

  pub fun main(): UFix64 {
  return ${TokenDetails.name}.totalSupply
  }
  `;
};

module.exports = {
  getTokenBalanceOfAccount,
  getTokenTotalSupply,
};
