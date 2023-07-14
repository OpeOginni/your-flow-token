// Import the NFTStorage class and File constructor from the 'nft.storage' package
import { NFTStorage, File, Blob } from "nft.storage";
import { Blockstore } from "nft.storage/src/platform.js";

// The 'mime' npm package helps us set the correct file type on our File objects
import mime from "mime";

require("dotenv").config();

// Paste your NFT.Storage API key into the quotes:
const NFT_STORAGE_KEY = process.env.NEXT_PUBLIC_NFT_STORAGE_KEY;

/**
 * Reads an image file from `imagePath` and stores an NFT with the given name and description.
 * @param {string} imagePath the path to an image file
 * @param {string} name a name for the NFT
 * @param {string} description a text description for the NFT
 */
export async function uploadToIPFS(image, nftName, nftDescription) {
  // create a new NFTStorage client using our API key
  const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY });

  try {
    let metadata = await nftstorage.store({
      name: nftName,
      image: image && new File([image], image.name, { type: image.type }),
      description: nftDescription,
    });

    // If all goes well, return the metadata.

    return metadata;
  } catch (e) {
    return console.log(e);
  }
}
