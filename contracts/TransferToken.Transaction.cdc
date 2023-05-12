import MyFlowToken from "./TestToken.cdc"
import FungibleToken from "./FungibleToken.cdc"


transaction(receiverAccount: Address, amount: UFix64) {

    prepare(acct: AuthAccount) {
        let signerVault = acct.borrow<&MyFlowToken.Vault>(from: /storage/Vault)
                                    ?? panic("Couldn't get the Signer's Vault")

        let receiverVault = getAccount(receiverAccount).getCapability(/public/Vault)
                                    .borrow<&MyFlowToken.Vault{FungibleToken.Receiver}>()
                                    ?? panic("Couldn't get the Receiver's Vault")

        receiverVault.deposit(from: <- signerVault.withdraw(amount: amount))
    }

    execute{
        log("Transfered Tokens")
    }
}