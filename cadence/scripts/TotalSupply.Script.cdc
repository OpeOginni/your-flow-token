import MyFlowToken from "../contracts/TestToken.cdc"

pub fun main(): UFix64 {
return MyFlowToken.totalSupply
}