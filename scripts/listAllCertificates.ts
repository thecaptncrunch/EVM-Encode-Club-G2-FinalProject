
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

async function main() {
  try {
    const total = await publicClient.readContract({
      address: contractAddress,
      abi: contractJson.abi,
      functionName: 'totalSupply',
    });

    console.log(`Total certificates: ${total}\n`);

    for (let i = 0; i < Number(total); i++) {
      const owner = await publicClient.readContract({
        address: contractAddress,
        abi: contractJson.abi,
        functionName: 'ownerOf',
        args: [BigInt(i)],
      });

      console.log(`Certificate #${i} → Owner: ${owner}`);
    }
  } catch (error) {
    console.error('Error listing certificates:', error);
  }
}

main();
