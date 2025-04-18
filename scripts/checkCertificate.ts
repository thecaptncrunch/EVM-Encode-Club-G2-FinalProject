
import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import dotenv from 'dotenv';
import contractJson from '../artifacts/contracts/CertificateNFT.sol/CertificateNFT.json';

dotenv.config();

const contractAddress = process.env.NFT_Key as `0x${string}`;

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(process.env.RPC_ENDPOINT_URL!),
});


const addressToCheck = process.argv[2];

if (!addressToCheck) {
  console.log("Please provide an address to check.");
  process.exit(1);
}

async function main() {
  try {
    const balance = await publicClient.readContract({
      address: contractAddress,
      abi: contractJson.abi,
      functionName: 'balanceOf',
      args: [addressToCheck],
    });

    if (Number(balance) > 0) {
      console.log(`✅ Address ${addressToCheck} has ${balance} certificate(s).`);
    } else {
      console.log(`❌ Address ${addressToCheck} does not have any certificate.`);
    }
  } catch (error) {
    console.error('Error checking certificate:', error);
  }
}

main();
