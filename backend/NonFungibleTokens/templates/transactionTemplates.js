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

export const mintNFT = (
  collectionName,
  collectionContractAddress,
  NonFungibleTokenStandardAddress,
  metadataViewStandardAddress
) => {
  return `
    import ${collectionName} from ${collectionContractAddress}
    import NonFungibleToken from ${NonFungibleTokenStandardAddress}
    import MetadataViews from ${metadataViewStandardAddress}
    
    transaction(    
        recipient: Address,
        name: String,
        description: String,
        thumbnail: String,
        metadata: {String: String} 
        ) {
    
        /// local variable for storing the minter reference
        let minter: &${collectionName}.NFTMinter
    
        /// Reference to the receiver's collection
        let recipientCollectionRef: &{NonFungibleToken.CollectionPublic}
    
        /// Previous NFT ID before the transaction executes
        let mintingIDBefore: UInt64
       
    prepare(signer: AuthAccount) {
    
            self.mintingIDBefore = ${collectionName}.totalSupply
    
            // borrow a reference to the NFTMinter resource in storage
            self.minter = signer.borrow<&${collectionName}.NFTMinter>(from: ${collectionName}.MinterStoragePath)
                ?? panic("Account does not store an object at the specified path")
    
    
            // Borrow the recipient's public NFT collection reference
            self.recipientCollectionRef = getAccount(recipient)
                .getCapability(${collectionName}.CollectionPublicPath)
                .borrow<&{NonFungibleToken.CollectionPublic}>()
                ?? panic("Could not get receiver reference to the NFT Collection")
    }
    
    
    
    execute {
            // Mint the NFT and deposit it to the recipient's collection
            self.minter.mintNFT(
                recipient: self.recipientCollectionRef,
                name: name,
                description: description,
                thumbnail: thumbnail,
                metadata: metadata
            )
    }
    post {
      self.recipientCollectionRef.getIDs().contains(self.mintingIDBefore): "The next NFT ID should have been minted and delivered"
      ${collectionName}.totalSupply == self.mintingIDBefore + 1: "The total supply should have been increased by 1"
  }
    }
    `;
};
