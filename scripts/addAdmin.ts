import { createWalletClient, http, encodeFunctionData } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
import contractJson from "../artifacts/contracts/CertificateNFT.sol/CertificateNFT.json";

dotenv.config();

const contractAddress = process.env.NFT_KEY as `0x${string}`;
console.log("✅ NFT_KEY from env:", process.env.NFT_KEY);

const privateKey = `0x${process.env.PRIVATE_KEY!}` as `0x${string}`;
const rpcUrl = process.env.RPC_ENDPOINT_URL!;

if (!contractAddress || !privateKey || !rpcUrl) {
  throw new Error("❌ Missing env variables");
}

const account = privateKeyToAccount(privateKey);

const walletClient = createWalletClient({
  account,
  chain: sepolia,
  transport: http(rpcUrl),
});

async function main() {
  const newAdmin = process.argv[2] as `0x${string}`;

  if (!newAdmin || !/^0x[a-fA-F0-9]{40}$/.test(newAdmin)) {
    throw new Error("❌ Invalid or missing Ethereum address.");
  }

  console.log(`🛠️ Granting ADMIN_ROLE to: ${newAdmin}`);

  const hash = await walletClient.writeContract({
    address: contractAddress,
    abi: contractJson.abi,
    functionName: "addAdmin",
    args: [newAdmin],
    account,
  });

  console.log(`✅ Transaction Hash: ${hash}`);
}

main().catch((err) => {
  console.error("❌ Failed to grant admin:", err);
  process.exit(1);
});
