import { config } from "@onflow/fcl";

config({
  "accessNode.api": "https://rest-testnet.onflow.org", // Mainnet https://access-mainnet.onflow.org
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
  "discovery.authn.endpoint":
    "https://fcl-discovery.onflow.org/api/testnet/authn",
  "app.detail.icon": "https://placekitten.com/g/200/200",
  "app.detail.title": "My Flow Token",
});
