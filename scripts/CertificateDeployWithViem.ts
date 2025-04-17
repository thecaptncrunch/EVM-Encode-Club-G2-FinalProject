import { createWalletClient, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import dotenv from "dotenv";
import contractJson from "../artifacts/contracts/CertificateNFT.sol/CertificateNFT.json";

dotenv.config();

async function main() {
  // Load account from private key
  const privateKey = `0x${process.env.PRIVATE_KEY!}` as `0x${string}`;
  const account = privateKeyToAccount(privateKey);

  // Configure RPC provider (Alchemy or other)
  const rpcUrl = process.env.RPC_ENDPOINT_URL!;
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(rpcUrl),
  });

  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(rpcUrl),
  });

  console.log("Deploying contract with address:", account.address);

  // Deploy the contract with the account as initialOwner
  const hash = await walletClient.deployContract({
    abi: contractJson.abi,
    bytecode: contractJson.bytecode as `0x${string}`,
    args: [account.address],
  });

  console.log("Transaction hash:", hash);

  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  console.log("✅ Contract deployed at:", receipt.contractAddress);
}

main().catch((err) => {
  console.error("❌ Deployment failed:", err);
  process.exit(1);
});
