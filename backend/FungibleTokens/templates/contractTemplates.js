// Contract Template for users who do not want a Total Supply for their token

export const customTokenContractWithoutTotalSupply = (
  TokenDetails,
  fungibleTokenStandardAddress
) => {
  return `
import FungibleToken from ${fungibleTokenStandardAddress}

 access(all) contract ${TokenDetails.name}: FungibleToken {
    pub var totalSupply: UFix64 // If users what to have a totalSupply

    /// TokensInitialized
    ///
    /// The event that is emitted when the contract is created
    pub event TokensInitialized(initialSupply: UFix64)

    /// TokensWithdrawn
    ///
    /// The event that is emitted when tokens are withdrawn from a Vault
    pub event TokensWithdrawn(amount: UFix64, from: Address?)

    /// TokensDeposited
    ///
    /// The event that is emitted when tokens are deposited to a Vault
    pub event TokensDeposited(amount: UFix64, to: Address?)

    /// TokensMinted
    ///
    /// The event that is emitted when new tokens are minted
    pub event TokensMinted(amount: UFix64)

    pub resource Vault: FungibleToken.Provider, FungibleToken.Receiver, FungibleToken.Balance {
        pub var balance: UFix64

        init(balance: UFix64) {
            self.balance = balance
        }

        pub fun withdraw(amount: UFix64): @FungibleToken.Vault {
            self.balance = self.balance - amount
            emit TokensWithdrawn(amount: amount, from: self.owner?.address)
            return <- create Vault(balance: amount)
        }

        pub fun deposit(from: @FungibleToken.Vault) {
            let vault <- from as! @${TokenDetails.name}.Vault
            self.balance = self.balance + vault.balance 
            emit TokensDeposited(amount: vault.balance, to: self.owner?.address)
            vault.balance = 0.0
            destroy vault // Make sure we get rid of the vault
        }

        destroy() {
            ${TokenDetails.name}.totalSupply = ${TokenDetails.name}.totalSupply - self.balance
        }
    }

    pub fun createEmptyVault(): @FungibleToken.Vault {
        return <- create Vault(balance: 0.0)
    }

    pub resource Minter {
        pub fun mintToken(amount: UFix64): @FungibleToken.Vault {
            pre {
                amount > 0.0: "Amount minted must be greater than zero"
            }
            ${TokenDetails.name}.totalSupply = ${TokenDetails.name}.totalSupply + amount
            emit TokensMinted(amount: amount)
            return <- create Vault(balance:amount)
        }
        
    }

    init() {
        self.totalSupply = 0.0

        self.account.save(<- create Minter(), to: /storage/${TokenDetails.name}Minter)
    }
 }
 
    `;
};

// Contract Template for users who DO want a Total Supply for their token

export const customTokenContractWithTotalSupply = (
  tokenDetails,
  fungibleTokenStandardAddress,
  totalSupplyValue
) => {
  return `
  import FungibleToken from ${fungibleTokenStandardAddress}
  
   access(all) contract ${tokenDetails.name}: FungibleToken {
    /// Total supply of tokens in existence, initial 0, and increase when new tokens are minted
      pub var totalSupply: UFix64
  
      pub event TokensInitialized(initialSupply: UFix64)
      pub event TokensWithdrawn(amount: UFix64, from: Address?)
      pub event TokensDeposited(amount: UFix64, to: Address?)
  
      pub resource Vault: FungibleToken.Provider, FungibleToken.Receiver, FungibleToken.Balance {
          pub var balance: UFix64
  
          init(balance: UFix64) {
              self.balance = balance
          }
  
          pub fun withdraw(amount: UFix64): @FungibleToken.Vault {
              self.balance = self.balance - amount
              emit TokensWithdrawn(amount: amount, from: self.owner?.address)
              return <- create Vault(balance: amount)
          }
  
          pub fun deposit(from: @FungibleToken.Vault) {
              let vault <- from as! @${tokenDetails.name}.Vault
              self.balance = self.balance + vault.balance 
              emit TokensDeposited(amount: vault.balance, to: self.owner?.address)
              vault.balance = 0.0
              destroy vault // Make sure we get rid of the vault
          }
  
          destroy() {
              ${tokenDetails.name}.totalSupply = ${tokenDetails.name}.totalSupply - self.balance
          }
      }
  
      pub fun createEmptyVault(): @FungibleToken.Vault {
          return <- create Vault(balance: 0.0)
      }
  
      pub resource Minter {
          pub fun mintToken(amount: UFix64): @FungibleToken.Vault {
              ${tokenDetails.name}.totalSupply = ${tokenDetails.name}.totalSupply + amount
              return <- create Vault(balance:amount)
          }
          
      }
  
      init() {
          self.totalSupply = 0.0
  
          self.account.save(<- create Minter(), to: /storage/${tokenDetails.name}Minter)
      }
   }
   
      `;
};
