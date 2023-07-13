import NFT from 0x01
import NonFungibleToken from 0x01
import MetadataViews from 0x01

transaction(    
    recipient: Address,
    name: String,
    description: String,
    thumbnail: String,
    metadata: {String: AnyStruct} 
    ) {

    /// local variable for storing the minter reference
    let minter: &TNT.NFTMinter

    /// Reference to the receiver's collection
    let recipientCollectionRef: &{NonFungibleToken.CollectionPublic}

    /// Previous NFT ID before the transaction executes
    let mintingIDBefore: UInt64
   
prepare(signer: AuthAccount) {

        self.mintingIDBefore = TNT.totalSupply

        // borrow a reference to the NFTMinter resource in storage
        self.minter = signer.borrow<&TNT.NFTMinter>(from: TNT.MinterStoragePath)
            ?? panic("Account does not store an object at the specified path")


        // Borrow the recipient's public NFT collection reference
        self.recipientCollectionRef = getAccount(recipient)
            .getCapability(TNT.CollectionPublicPath)
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
        NFT.totalSupply == self.mintingIDBefore + 1: "The total supply should have been increased by 1"
    }
}