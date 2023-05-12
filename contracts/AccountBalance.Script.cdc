import MyFlowToken from "./TestToken.cdc"
import FungibleToken from "./FungibleToken.cdc"

pub fun main(account: Address): UFix64 {
    let publicVault = getAccount(account).getCapability(/public/Vault)
        .borrow<&MyFlowToken.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow the public Vault.")
    return publicVault.balance
}