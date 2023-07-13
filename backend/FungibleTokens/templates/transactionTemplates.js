export const transferTokenTransaction = (
  TokenDetails,
  tokenContractAddress,
  FungibleTokenStandardAddress
) => {
  `
import ${tokenName} from ${tokenContractAddress}
import FungibleToken from ${FungibleTokenStandardAddress}

transaction(receiverAccount: Address, amount: UFix64) {
    prepare(acct: AuthAccount) {
        let signerVault = acct.borrow<&${tokenName}.Vault>(from: /storage/Vault)
                                    ?? panic("Couldn't get the Signer's Vault")

        let receiverVault = getAccount(receiverAccount).getCapability(/public/Vault)
                                    .borrow<&${tokenName}.Vault{FungibleToken.Receiver}>()
                                    ?? panic("Couldn't get the Receiver's Vault")

        receiverVault.deposit(from: <- signerVault.withdraw(amount: amount))
    }
    execute{
        log("Transfered Tokens")
    }
}
    `;
};

export const createVault = (
  tokenName,
  tokenContractAddress,
  FungibleTokenStandardAddress
) => {
  return `
    import ${tokenName} from ${tokenContractAddress}
    import FungibleToken from ${FungibleTokenStandardAddress}

transaction {

    prepare(acct: AuthAccount) {
        acct.save(<- ${tokenName}.createEmptyVault(), to: /storage/${tokenName}Vault)
        acct.link<&${tokenName}.Vault{FungibleToken.Balance, FungibleToken.Receiver}>(/public/${tokenName}Vault, target: /storage/${tokenName}Vault)
    }

    execute{
        
    }
}
    `;
};

export const mintToken = (
  tokenName,
  tokenContractAddress,
  FungibleTokenStandardAddress
) => {
  return `
    import ${tokenName} from ${tokenContractAddress}
    import FungibleToken from ${FungibleTokenStandardAddress}

    transaction(receiverAccount: Address, mintAmount: UFix64) {

        prepare(acct: AuthAccount) {
            let minter = acct.borrow<&${tokenName}.Minter>(from: /storage/${tokenName}Minter)
                                     ?? panic("We could not borrow the Minter resource")
            let newVault <- minter.mintTokens(amount: mintAmount)
            
            let receiverVault = getAccount(receiverAccount).getCapability(/public/${tokenName}Vault)
                                              .borrow<&${tokenName}.Vault{FungibleToken.Receiver}>()
                                              ?? panic("Couldn't get the public Vault")
                                              
            receiverVault.deposit(from: <- newVault)
        }
    
        execute{
            
        }
    }
    `;
};

export const hasTokenVault = (
  tokenName,
  tokenContractAddress,
  FungibleTokenStandardAddress
) => {
  return `
        import ${tokenName} from ${tokenContractAddress}
        import FungibleToken from ${FungibleTokenStandardAddress}

        pub fun main(user: Address): Bool {
           let vaultCapability = getAccount(user).getCapability(/public/${tokenName}Vault)
           let vault = vaultCapability.borrow<&${tokenName}.Vault{FungibleToken.Balance}>()
           return vault != nil
        }
        `;
};
