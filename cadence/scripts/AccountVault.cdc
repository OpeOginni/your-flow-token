import FungibleToken from "../contracts/FungibleToken.cdc"
import MyFlowToken from "../contracts/TestToken.cdc"
 // Replace 0x01 with the actual address of the FungibleToken contract

pub fun main(user: Address): Bool {
    let vaultCapability = getAccount(user).getCapability(/public/MyFlowTokenVault)
    let vault = vaultCapability.borrow<&MyFlowToken.Vault{FungibleToken.Balance}>()
    return vault != nil
}