console.clear();
require("dotenv").config();
const {
  Client,
  PrivateKey,
  AccountCreateTransaction,
  Hbar,
} = require("@hashgraph/sdk");

// Configure your client with operator account and key
const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = PrivateKey.fromStringDer(process.env.MY_PRIVATE_KEY);
const client = Client.forTestnet().setOperator(myAccountId, myPrivateKey);

async function main() {
  // Generate a new ECDSA private key
  const newPrivateKey = await PrivateKey.generateECDSA();
  const publicKey = newPrivateKey.publicKey;

  console.log("Private Key (DER Encoded):", newPrivateKey.toStringDer());

  // Create a new account with the public key
  const transactionResponse = await new AccountCreateTransaction()
    .setKey(publicKey)
    .setInitialBalance(Hbar.fromTinybars(1000)) // Set initial balance
    .setTransactionValidDuration(120)
    .execute(client);

  // Fetch the receipt of the transaction
  const receipt = await transactionResponse.getReceipt(client);
  const newAccountId = receipt.accountId;

  console.log("New Account ID:", newAccountId.toString());
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
