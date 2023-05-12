import MyFlowToken from "./TestToken.cdc"
import FungibleToken from "./FungibleToken.cdc"


transaction {

    prepare(acct: AuthAccount) {
        acct.save(<- MyFlowToken.createEmptyVault(), to: /storage/Vault)
        acct.link<&MyFlowToken.Vault{FungibleToken.Balance, FungibleToken.Receiver}>(/public/Vault, target: /storage/Vault)
    }

    execute{
        
    }
}