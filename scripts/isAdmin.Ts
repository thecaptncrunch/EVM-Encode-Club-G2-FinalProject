import { keccak256, createPublicClient, http, toBytes } from "viem";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
import contractJson from "../artifacts/contracts/CertificateNFT.sol/CertificateNFT.json";

dotenv.config();

const contractAddress = process.env.NFT_KEY as `0x${string}`;
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(process.env.RPC_ENDPOINT_URL!),
});


async function main() {
  const ADMIN_ROLE = keccak256(toBytes("ADMIN_ROLE"));

  const addressToCheck = process.argv[2] as `0x${string}`;
  if (!addressToCheck || !/^0x[a-fA-F0-9]{40}$/.test(addressToCheck)) {
    throw new Error("❌ Please provide a valid Ethereum address as argument.");
  }

  const isAdmin = await publicClient.readContract({
    address: contractAddress,
    abi: contractJson.abi,
    functionName: "hasRole",
    args: [ADMIN_ROLE, addressToCheck],
  });

  if (isAdmin) {
    console.log(`✅ ${addressToCheck} is an admin.`);
  } else {
    console.log(`❌ ${addressToCheck} is NOT an admin.`);
  }
}

main().catch(console.error);
