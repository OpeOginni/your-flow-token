import MyFlowToken from "../contracts/TestToken.cdc"
import FungibleToken from "../contracts/FungibleToken.cdc"

transaction(receiverAccount: Address) {

    prepare(acct: AuthAccount) {
        let minter = acct.borrow<&MyFlowToken.Minter>(from: /storage/Minter)
                                 ?? panic("We could not borrow the Minter resource")
        let newVault <- minter.mintToken(amount: 20.0)
        
        let receiverVault = getAccount(receiverAccount).getCapability(/public/Vault)
                                          .borrow<&MyFlowToken.Vault{FungibleToken.Receiver}>()
                                          ?? panic("Couldn't get the public Vault")
                                          
        receiverVault.deposit(from: <- newVault)
    }

    execute{
        
    }
}