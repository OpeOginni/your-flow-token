import * as scriptTemplates from "../../../backend/FungibleTokens/templates/scriptTemplates";

const runFlowScript = async () => {
  try {
    const user = await new Promise((resolve, reject) => {
      fcl.currentUser().subscribe(resolve, reject);
    });

    const fetchedContracts = await fcl.query({
      cadence: scriptTemplates.getAccountContracts(),
      args: (arg, t) => [arg(user.addr, t.Address)],
    });

    return fetchedContracts;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const sendQuery = async () => {
  try {
    const fetchedContracts = await runFlowScript();

    const newData = fetchedContracts.map((firstObj, index) => {
      const { contractName, contractAddress, contractType } = firstObj;

      return {
        id: `A.${contractAddress}.${contractName}`,
        _id: index,
        type: contractType.kind,
        name: contractName,
      };
    });
    return newData;
  } catch (error) {
    console.error(error);
  }
};

const initAccount = async () => {
  const transactionId = await fcl.mutate({
    // mutate
    cadence: `
        import Profile from 0xProfile

        transaction {
          prepare(account: AuthAccount) {
            // Only initialize the account if it hasn't already been initialized
            if (!Profile.check(account.address)) {
              // This creates and stores the profile in the user's account
              account.save(<- Profile.new(), to: Profile.privatePath)

              // This creates the public capability that lets applications read the profile's info
              account.link<&Profile.Base{Profile.Public}>(Profile.publicPath, target: Profile.privatePath)
            }
          }
        }
      `,
    payer: fcl.authz,
    proposer: fcl.authz,
    authorizations: [fcl.authz],
    limit: 50,
  });

  const transaction = await fcl.tx(transactionId).onceSealed();
  console.log(transaction);
};

const executeTransaction = async () => {
  const transactionId = await fcl.mutate({
    cadence: `
        import Profile from 0xProfile
  
        transaction(name: String) {
          prepare(account: AuthAccount) {
            account
              .borrow<&Profile.Base{Profile.Owner}>(from: Profile.privatePath)!
              .setName(name)
          }
        }
      `,
    args: (arg, t) => [arg("Opeyemi", t.String)],
    payer: fcl.authz,
    proposer: fcl.authz,
    authorizations: [fcl.authz],
    limit: 50,
  });

  fcl.tx(transactionId).subscribe((res) => setTransactionStatus(res.status));
};
