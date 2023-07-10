export const isNFTCollection = (
  collectionName,
  collectionContractAddress,
  NonFungibleTokenStandardAddress
) => {
  return `
          import ${collectionName} from ${collectionContractAddress}
          import NonFungibleToken from ${NonFungibleTokenStandardAddress}

          pub fun main(user: Address): Bool {
          let collection = getAccount(user)
          .getCapability(${collectionName}.CollectionPublicPath)
          .borrow<&{NonFungibleToken.CollectionPublic}>()
         return collection != nil
}
          `;
};
