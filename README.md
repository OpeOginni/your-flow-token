# Flow To The Future Hackathon

## Introduction to `Your Flow Token`

<img src="./images/yourflow-logo2.svg" alt="YourFlowToken" width="50px" style="margin-right: 30px;">

This hackathon project is a NextJS website that allows users to create tokens on the Flow Blockchain with just a few clicks. The project utilizes NextJS, ChakraUI, the @onflow/fcl package, JavaScript, and the Cadence. By connecting their wallet and providing the necessary details, users can easily generate tokens on the Flow Blockchain.

## Flow Blockchain: A Seamless Wallet Experience

The project is built on the Flow blockchain, a fast and developer-friendly blockchain designed for building decentralized applications. Flow stands out for its seamless wallet experience, making it easy for users to interact with blockchain-based applications, and also developers as allowing users to interact with your platform is really easy.

One of the key reasons I enjoyed using Flow is its simple yet powerful wallet system. Users can effortlessly log in to their wallets by entering their email address, eliminating the need for complex private key management. This user-friendly approach not only enhances the overall user experience but also lowers the barrier to entry for new users to participate in the blockchain ecosystem.

With Flow's wallet system, users can securely manage their digital assets, sign transactions, and engage with decentralized applications, all with just a few clicks. This streamlined experience promotes user adoption and enables a wider audience to leverage the benefits of blockchain technology.

## Installation and Setup

To run this project locally, follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the `frontend` directory on the terminal with `cd frontend`.
3. Install the dependencies by running the command `npm install`.
4. Start the development server with `npm run dev`.

## How To Create a Fungible Token on the Flow Blockchain

1. Open your web browser and navigate to the URL where the project is [running](https://your-flow-token.vercel.app/).
2. Choose which network you would like to deploy your token on. (Either Mainnet or Testnet).
3. Connect your wallet by clicking the Login button and following the authentication process.
4. Choose whoch type of Token you would like to create. (NFT creation is not available yet)
5. Provide the necessary details for token creation, such as name, and decide if you would like an Initial Mint.
6. Click the "Create Token" button to initiate the token creation process.
7. Wait for the transaction to be confirmed on the Flow Blockchain.
8. Once the token is successfully created, you will receive a confirmation message.

## How To Mint the token for other Users

1. Let the user who you want to Mint a token for create aa Vault for that token.
2. They would need to put in the Token Name and The token creator's address(Your Address).
3. After the token vault has been created, you can mint them that token by providing their Wallet Address and the Amount you want to Mint for the user, then click on the MINT button.
4. Sign the transaction and BOOM, you have Minted your own token for another user.

## Update for Flow Hackathon Season 2

Users can now create Collections and MINT NFTs🥳

## Technologies Used

This project leverages the following technologies and languages:

<div style="display: flex; justify-content: center; align-items: center;">
  <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer">
    <img src="./images/nextjs.svg" alt="NextJS" width="50px" style="margin-right: 30px;">
  </a>
  <a href="https://chakra-ui.com/" target="_blank" rel="noopener noreferrer">
    <img src="./images/chakraUI.svg" alt="ChakraUI" width="50px" style="margin-right: 30px;">
  </a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noopener noreferrer">
    <img src="./images/js.svg" alt="JavaScript" width="50px" style="margin-right: 30px;">
  </a>
  <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer">
    <img src="./images/tailwindcss.svg" alt="TailwindCSS" width="50px" style="margin-right: 30px;">
  </a>
  <a href="https://flow.com/" target="_blank" rel="noopener noreferrer">
    <img src="https://cryptologos.cc/logos/flow-flow-logo.svg?v=025" alt="Cadence" width="50px">
  </a>
</div>

## Future Considerations / WIP

At the moment users can only create Fungible Tokens, I would like to add the functionality to allow users create Non-Fungible Tokens too.

## Contributing

Contributions to this project are welcome. If you encounter any issues or have suggestions for improvements, please submit them as GitHub issues. You can also fork the repository, make your changes, and create a pull request.

## Acknowledgements

- [NextJS](https://nextjs.org/)
- [ChakraUI](https://chakra-ui.com/)
- [Flow Blockchain](https://flow.com/)
- [Jacob Tucker](https://www.youtube.com/@jacobmtucker)
