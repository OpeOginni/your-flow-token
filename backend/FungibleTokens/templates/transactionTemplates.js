const transferTokenTransaction = (
  TokenDetails,
  FungibleTokenStandardAddress
) => {
  `
import ${TokenDetails.name} from ${TokenDetails.contractAddress}
import FungibleToken from ${FungibleTokenStandardAddress}

transaction(receiverAccount: Address, amount: UFix64) {
    prepare(acct: AuthAccount) {
        let signerVault = acct.borrow<&${TokenDetails.name}.Vault>(from: /storage/Vault)
                                    ?? panic("Couldn't get the Signer's Vault")

        let receiverVault = getAccount(receiverAccount).getCapability(/public/Vault)
                                    .borrow<&${TokenDetails.name}.Vault{FungibleToken.Receiver}>()
                                    ?? panic("Couldn't get the Receiver's Vault")

        receiverVault.deposit(from: <- signerVault.withdraw(amount: amount))
    }
    execute{
        log("Transfered Tokens")
    }
}
    `;
};

const createVault = (TokenDetails, FungibleTokenStandardAddress) => {
  `
    import ${TokenDetails.name} from ${TokenDetails.contractAddress}
    import FungibleToken from ${FungibleTokenStandardAddress}

transaction {

    prepare(acct: AuthAccount) {
        acct.save(<- ${TokenDetails.name}.createEmptyVault(), to: /storage/Vault)
        acct.link<&${TokenDetails.name}.Vault{FungibleToken.Balance, FungibleToken.Receiver}>(/public/Vault, target: /storage/Vault)
    }

    execute{
        
    }
}
    `;
};

const mintToken = (TokenDetails, FungibleTokenStandardAddress) => {
  `
    import ${TokenDetails.name} from ${TokenDetails.contractAddress}
    import FungibleToken from ${FungibleTokenStandardAddress}

    transaction(receiverAccount: Address, mintAmount: UFix64) {

        prepare(acct: AuthAccount) {
            let minter = acct.borrow<&${TokenDetails.name}.Minter>(from: /storage/Minter)
                                     ?? panic("We could not borrow the Minter resource")
            let newVault <- minter.mintToken(amount: mintAmount)
            
            let receiverVault = getAccount(receiverAccount).getCapability(/public/Vault)
                                              .borrow<&${TokenDetails.name}.Vault{FungibleToken.Receiver}>()
                                              ?? panic("Couldn't get the public Vault")
                                              
            receiverVault.deposit(from: <- newVault)
        }
    
        execute{
            
        }
    }
    `;
};
