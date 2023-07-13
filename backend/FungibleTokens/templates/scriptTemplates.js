/* Here I keep All Important Scripts needed to Interact with a Fungible Token Contract

  They are exported in the form of functions that returns the script as some details in the cadence scripts will be dynamic 

  The Scripts Here at the moment are:

  - Get Account Token Balance Script
  - Get Token Total Supply Script
  - Get Account Contracts Script (Made Personally and Tested using the Flow Playground Site)
*/

/* This Script Gets the amount of tokens in a Flow Account */
export const getTokenBalanceOfAccount = (
  TokenDetails,
  FungibleTokenStandardAddress
) => {
  return `
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

/* This Script Gets the Total Supply of a Token on flow */
export const getTokenTotalSupply = (TokenDetails) => {
  return `
  import ${TokenDetails.name} from ${TokenDetails.contractAddress}

  pub fun main(): UFix64 {
  return ${TokenDetails.name}.totalSupply
  }
  `;
};

/* This script is a really nice one,
  I found it while playing around in the flow playground.
  It fetches all contracts from a particular Flow Account,
  I used it to add a feature to my app that let users see their deployed contracts and access them straight from the app.
*/
export const getAccountContracts = () => {
  return `
  pub struct ContractDetails {
    pub let contractName: String
    pub let contractAddress: Address
    pub let contractType: Type

    init(_contractName: String, _contractAddress: Address, _contractType: Type){
    self.contractName = _contractName
    self.contractAddress = _contractAddress
    self.contractType = _contractType
    }
}

pub fun main(account: Address): [ContractDetails] {
var contractDetailsArray: [ContractDetails] = []
var count = 0
let contracts = getAccount(account).contracts
let contractNames = contracts.names
for contractName in contractNames {
let contractDetails = contracts.get(name: contractName)
   ?? panic("No Contracts")
let _contract =  ContractDetails(_contractName: contractName ,_contractAddress: contractDetails.address,_contractType: contractDetails.getType())
contractDetailsArray.insert(at: count, _contract)
count = count + 1
   }
return  contractDetailsArray
}
  `;
};
