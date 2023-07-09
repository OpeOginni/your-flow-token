// This is a TEST NFT CONTRACT
import NonFungibleToken from "./NonFungibleToken.cdc";
import MetadataViews from "./MetadataViews.cdc";

// Here we tell Cadence that our BottomShot contract implements the interface
pub contract BottomShot: NonFungibleToken {

  pub var totalSupply: UInt64

  pub event ContractInitialized()
  pub event Withdraw(id: UInt64, from: Address?)
  pub event Deposit(id: UInt64, to: Address?)

  pub let CollectionStoragePath: StoragePath
  pub let CollectionPublicPath: PublicPath
  pub let MinterStoragePath: StoragePath

  // Our NFT resource conforms to the INFT interface
  pub resource NFT: NonFungibleToken.INFT, MetadataViews.Resolver {
    pub let id: UInt64

    pub let name: String
    pub let description: String
    pub let thumbnail: String

    // METADATA THINGS
/*
access(self) let metadata: {String: AnyStruct} 
        init(
            id: UInt64,
            name: String,
            description: String,
            thumbnail: String,
            royalties: [MetadataViews.Royalty],
            metadata: {String: AnyStruct},
        ) {
            self.id = id
            self.name = name
            self.description = description
            self.thumbnail = thumbnail
            self.royalties = royalties
            self.metadata = metadata
        }
 */   


    init(
        id: UInt64,
        name: String,
        description: String,
        thumbnail: String,
    ) {
        self.id = id
        self.name = name
        self.description = description
        self.thumbnail = thumbnail
    }

    pub fun getViews(): [Type] {
      return [
        Type<MetadataViews.Display>()
      ]
    }

    pub fun resolveView(_ view: Type): AnyStruct? {
      switch view {
        case Type<MetadataViews.Display>():
          return MetadataViews.Display(
            name: self.name,
            description: self.description,
            thumbnail: MetadataViews.HTTPFile(
              url: self.thumbnail
            )
          )
      }
      return nil
    }
  }

  pub resource interface BottomShotCollectionPublic {
    pub fun deposit(token: @NonFungibleToken.NFT)
    pub fun getIDs(): [UInt64]
    pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
  }

  // Same goes for our Collection, it conforms to multiple interfaces 
  pub resource Collection: BottomShotCollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic,  MetadataViews.ResolverCollection {
    pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

    init () {
      self.ownedNFTs <- {}
    }
    
    // An upgraded deposit function
    pub fun deposit(token: @NonFungibleToken.NFT) {
      let token <- token as! @BottomShot.NFT

      let id: UInt64 = token.id

      // Add the new token to the dictionary, this removes the old one
      let oldToken <- self.ownedNFTs[id] <- token
      
      // Trigger an event to let listeners know an NFT was deposited to this collection
      emit Deposit(id: id, to: self.owner?.address)
      
      // Destroy (burn) the old NFT
      destroy oldToken
    }

    pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
      let token <- self.ownedNFTs.remove(key: withdrawID) ??
        panic("This collection doesn't contain an NFT with that ID")

      emit Withdraw(id: token.id, from: self.owner?.address)

      return <-token
    }

    // getIDs returns an array of the IDs that are in the collection
    pub fun getIDs(): [UInt64] {
      return self.ownedNFTs.keys
    }

    pub fun borrowViewResolver(id: UInt64): &AnyResource{MetadataViews.Resolver} {
      let nft = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
      let BottomShot = nft as! &BottomShot.NFT
      return BottomShot as &AnyResource{MetadataViews.Resolver}
    }

    pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
      return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
    }



    destroy() {
      destroy self.ownedNFTs
    }
  }

  pub fun createEmptyCollection(): @NonFungibleToken.Collection {
    return <- create Collection()
  }
    pub resource NFTMinter {

  // Mints a new NFT with a new ID and deposits it 
  // in the recipients collection using their collection reference
      pub fun mintNFT(
        recipient: &{NonFungibleToken.CollectionPublic},
        name: String,
        description: String,
        thumbnail: String,
      ) {
        // create a new NFT
        var newNFT <- create NFT(
          id: BottomShot.totalSupply,
          name: name,
          description: description,
          thumbnail: thumbnail
        )

// Incase of METADATA
        /*
            let metadata: {String: AnyStruct} = {}
            let currentBlock = getCurrentBlock()
            metadata["mintedBlock"] = currentBlock.height
            metadata["mintedTime"] = currentBlock.timestamp
            metadata["minter"] = recipient.owner!.address

            // this piece of metadata will be used to show embedding rarity into a trait
            metadata["foo"] = "bar"

            // create a new NFT
            var newNFT <- create NFT(
                id: ExampleNFT.totalSupply,
                name: name,
                description: description,
                thumbnail: thumbnail,
                royalties: royalties,
                metadata: metadata,
            )
         */

        // Deposit it in the recipient's account using their collection ref
        recipient.deposit(token: <-newNFT)
    
        BottomShot.totalSupply = BottomShot.totalSupply + 1
      }
    }

    pub fun resolveView(_ view: Type): AnyStruct? {
        switch view {
            case Type<MetadataViews.NFTCollectionData>():
                return MetadataViews.NFTCollectionData(
                    storagePath: BottomShot.CollectionStoragePath,
                    publicPath: BottomShot.CollectionPublicPath,
                    providerPath: /private/exampleNFTCollection,
                    publicCollection: Type<&BottomShot.Collection{BottomShot.BottomShotCollectionPublic}>(),
                    publicLinkedType: Type<&BottomShot.Collection{BottomShot.BottomShotCollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver,MetadataViews.ResolverCollection}>(),
                    providerLinkedType: Type<&BottomShot.Collection{BottomShot.BottomShotCollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Provider,MetadataViews.ResolverCollection}>(),
                    createEmptyCollectionFunction: (fun (): @NonFungibleToken.Collection {
                        return <-BottomShot.createEmptyCollection()
                    })
                )
            case Type<MetadataViews.NFTCollectionDisplay>():
                let media = MetadataViews.Media(
                    file: MetadataViews.HTTPFile(
                        url: "https://assets.website-files.com/5f6294c0c7a8cdd643b1c820/5f6294c0c7a8cda55cb1c936_Flow_Wordmark.svg" // DYNAMIC || NULL
                    ),
                    mediaType: "image/svg+xml" // DYNAMIC || NULL
                )
                return MetadataViews.NFTCollectionDisplay(
                    name: "The Example Collection", // DYNAMIC
                    description: "This collection is used as an example to help you develop your next Flow NFT.", // DYNAMIC
                    externalURL: MetadataViews.ExternalURL("https://example-nft.onflow.org"), // DYNAMIC || NULL
                    squareImage: media, // DYNAMIC || NULL
                    bannerImage: media, // DYNAMIC || NULL
                    socials: {
                        "twitter": MetadataViews.ExternalURL("https://twitter.com/flow_blockchain") // DYNAMIC || NULL
                    }
                )
        }
        return nil
    }

    /// Function that returns all the Metadata Views implemented by a Non Fungible Token
    ///
    /// @return An array of Types defining the implemented views. This value will be used by
    ///         developers to know which parameter to pass to the resolveView() method.
    ///
    pub fun getViews(): [Type] {
        return [
            Type<MetadataViews.NFTCollectionData>(),
            Type<MetadataViews.NFTCollectionDisplay>()
        ]
    }


  init() {
    self.totalSupply = 0

    self.CollectionStoragePath = /storage/BottomShotCollection
    self.CollectionPublicPath = /public/BottomShotCollection
    self.MinterStoragePath = /storage/BottomShotMinter

    // Create a Collection for the deployer
    let collection <- create Collection()
    self.account.save(<-collection, to: self.CollectionStoragePath)

    // Create a public capability for the collection
    self.account.link<&BottomShot.Collection{NonFungibleToken.CollectionPublic, BottomShot.BottomShotCollectionPublic}>(
      self.CollectionPublicPath,
      target: self.CollectionStoragePath
    )

        // Create a Minter resource and save it to storage
        let minter <- create NFTMinter()
        self.account.save(<-minter, to: self.MinterStoragePath)

    emit ContractInitialized()
  }
}