import * as fcl from "@onflow/fcl";

export const flowConfig = (networkType) => {
  if (networkType === "TESTNET") {
    fcl
      .config()
      .put("accessNode.api", "https://rest-testnet.onflow.org")
      .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")
      .put(
        "discovery.authn.endpoint",
        "https://fcl-discovery.onflow.org/api/testnet/authn"
      )
      .put("app.detail.icon", "https://placekitten.com/g/200/200")
      .put("app.detail.title", "Your Flow Token");
  } else if (networkType === "MAINNET") {
    fcl
      .config()
      .put("accessNode.api", "https://access-mainnet.onflow.org")
      .put("discovery.wallet", "https://fcl-discovery.onflow.org/authn")
      .put(
        "discovery.authn.endpoint",
        "https://fcl-discovery.onflow.org/api/authn"
      )
      .put("app.detail.icon", "https://placekitten.com/g/200/200")
      .put("app.detail.title", "Your Flow Token");
  }
};
