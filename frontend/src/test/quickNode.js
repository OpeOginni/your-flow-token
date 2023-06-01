var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
};

fetch(
  "https://white-winter-gas.flow-mainnet.discover.quiknode.pro/f7b2a3b945fe867b68848f37e744596578ebf72c/v1/accounts/0xecfad18ba9582d4f?expand=keys,contracts",
  requestOptions
)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.log("error", error));
