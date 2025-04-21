import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import dotenv from 'dotenv';
import contractJson from '../artifacts/contracts/CertificateNFT.sol/CertificateNFT.json';

dotenv.config();

async function main() {
  const contractAddress = process.env.NFT_Key as `0x${string}`;
  const tokenId = 1; // 🔁 Change this number according to the certificate you want to revoke.

  const privateKey = `0x${process.env.PRIVATE_KEY!}` as `0x${string}`;
  const account = privateKeyToAccount(privateKey);

  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(process.env.RPC_ENDPOINT_URL!)
  });

  console.log(`Revoking certificate with token ID: ${tokenId}`);

  const hash = await walletClient.writeContract({
    abi: contractJson.abi,
    address: contractAddress,
    functionName: 'revokeCertificate',
    args: [tokenId],
    account,
  });

  console.log('✅ Transaction hash:', hash);
}

main().catch((err) => {
  console.error('❌ Revoke failed:', err);
  process.exit(1);
});
