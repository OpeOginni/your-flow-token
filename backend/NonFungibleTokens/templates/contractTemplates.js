export const customNFTCollectionContract = (
  nftName,
  ipfsHash,
  metadata = {},
  nonFungibleTokenStandardAddress
) => {
  return `

import NonFungibleToken from ${nonFungibleTokenStandardAddress}

pub contract ${nftName}: NonFungibleToken {

pub var totalSupply: UInt64

pub event ContractInitialized()
pub event Withdraw(id: UInt64, from: Address?)
pub event Deposit(id: UInt64, to: Address?)

	pub let CollectionStoragePath: StoragePath
	pub let CollectionPublicPath: PublicPath

pub resource NFT: NonFungibleToken.INFT{
    pub let id: UInt64
    pub let ipfsHash: String
    pub var metadata: {String: String}

    init(_ipfsHash: String, _metadata: {String: String}) {
    self.id = ${nftName}.totalSupply
    ${nftName}.totalSupply = ${nftName}.totalSupply + 1 

      self.ipfsHash = _ipfsHash
      self.metadata = _metadata
    }
}

    pub resource interface CollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowEntireNFT(id: UInt64): &NFT
    }


pub resource Collection: NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, CollectionPublic  {
    // id of the NFT --> NFT with that id
    pub var ownedNFTs : @{UInt64: NonFungibleToken.NFT}

		init () {
			self.ownedNFTs <- {}
		}
    
    pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
        let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")
		let id: UInt64 = token.id

        emit Withdraw(id: id, from: self.owner?.address)

        return <-token
    }

    pub fun deposit(token: @NonFungibleToken.NFT) {
        let token <- token as! @${nftName}.NFT
		let id: UInt64 = token.id

        emit Deposit(id: id, to: self.owner?.address)

        self.ownedNFTs[token.id] <-! token
    }

    pub fun getIDs(): [UInt64] {
        return self.ownedNFTs.keys
    }

    pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
        return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
    }

    pub fun borrowEntireNFT(id: UInt64): &NFT {
        let reference = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
        return reference as! &NFT
    }

	destroy() {
		destroy self.ownedNFTs
	}
}

    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Collection()
    }

    pub fun mintNFT(ipfsHash: String, metadata: {String: String}): @${nftName}.NFT {
        return <- create NFT(_ipfsHash: ipfsHash, _metadata: metadata)
    }


init(){
        self.totalSupply = 0
		self.CollectionStoragePath = /storage/${nftName}Collection
		self.CollectionPublicPath = /public/${nftName}Collection
    emit ContractInitialized()
    // Gives the creator of the NFT a Collection
        self.account.save(<- self.createEmptyCollection(), to: ${nftName}.CollectionStoragePath)
        self.account.link<&${nftName}.Collection{CollectionPublic}>(${nftName}.CollectionPublicPath, target: ${nftName}.CollectionStoragePath)

    let collection = self.account.borrow<&${nftName}.Collection>(from: ${nftName}.CollectionStoragePath)!

    collection.deposit(token: <-self.mintNFT(ipfsHash: ${ipfsHash}, metadata: ${metadata}))

    }
}
`;
};

export const customNFTCollectionContractWithNameAndImage = (
  nftName,
  ipfsHash,
  nonFungibleTokenStandardAddress
) => {
  return `
  
  import NonFungibleToken from ${nonFungibleTokenStandardAddress}
  
  pub contract ${nftName}: NonFungibleToken {
  
  pub var totalSupply: UInt64
  
  pub event ContractInitialized()
  pub event Withdraw(id: UInt64, from: Address?)
  pub event Deposit(id: UInt64, to: Address?)
  
      pub let CollectionStoragePath: StoragePath
      pub let CollectionPublicPath: PublicPath
  
  pub resource NFT: NonFungibleToken.INFT{
      pub let id: UInt64
      pub let ipfsHash: String
      pub var name: String
  
      init(_ipfsHash: String, _name: String) {
      self.id = ${nftName}.totalSupply
      ${nftName}.totalSupply = ${nftName}.totalSupply + 1 
  
        self.ipfsHash = _ipfsHash
        self.name = _name
      }
  }
  
      pub resource interface CollectionPublic {
          pub fun deposit(token: @NonFungibleToken.NFT)
          pub fun getIDs(): [UInt64]
          pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
          pub fun borrowEntireNFT(id: UInt64): &NFT
      }
  
  
  pub resource Collection: NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, CollectionPublic  {
      // id of the NFT --> NFT with that id
      pub var ownedNFTs : @{UInt64: NonFungibleToken.NFT}
  
          init () {
              self.ownedNFTs <- {}
          }
      
      pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
          let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")
          let id: UInt64 = token.id
  
          emit Withdraw(id: id, from: self.owner?.address)
  
          return <-token
      }
  
      pub fun deposit(token: @NonFungibleToken.NFT) {
          let token <- token as! @${nftName}.NFT
          let id: UInt64 = token.id
  
          emit Deposit(id: id, to: self.owner?.address)
  
          self.ownedNFTs[token.id] <-! token
      }
  
      pub fun getIDs(): [UInt64] {
          return self.ownedNFTs.keys
      }
  
      pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
          return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
      }
  
      pub fun borrowEntireNFT(id: UInt64): &NFT {
          let reference = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
          return reference as! &NFT
      }
  
      destroy() {
          destroy self.ownedNFTs
      }
  }
  
      pub fun createEmptyCollection(): @NonFungibleToken.Collection {
          return <- create Collection()
      }
  
      pub fun mintNFT(ipfsHash: String, name: String): @${nftName}.NFT {
          return <- create NFT(_ipfsHash: ipfsHash, _name: name)
      }
  
  
  init(){
          self.totalSupply = 0
          self.CollectionStoragePath = /storage/${nftName}Collection
          self.CollectionPublicPath = /public/${nftName}Collection
      emit ContractInitialized()
      // Gives the creator of the NFT a Collection
          self.account.save(<- self.createEmptyCollection(), to: ${nftName}.CollectionStoragePath)
          self.account.link<&${nftName}.Collection{CollectionPublic}>(${nftName}.CollectionPublicPath, target: ${nftName}.CollectionStoragePath)
  
      let collection = self.account.borrow<&${nftName}.Collection>(from: ${nftName}.CollectionStoragePath)!
  
      collection.deposit(token: <-self.mintNFT(ipfsHash: ${ipfsHash}, name: ${nftName}))
      }
  }
  `;
};
