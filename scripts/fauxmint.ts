import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import dotenv from 'dotenv';
import contractJson from '../artifacts/contracts/CertificateNFT.sol/CertificateNFT.json';

dotenv.config();

async function main() {
  const contractAddress = process.env.NFT_Key as `0x${string}`;
  if (!contractAddress) {
    throw new Error("❌ Missing NFT_Key in .env");    
  }

  const privateKey = `0x${process.env.PRIVATE_KEY!}` as `0x${string}`;
  const account = privateKeyToAccount(privateKey);

  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(process.env.RPC_ENDPOINT_URL!)
  });

  const recipients = [
    { address: '0x1234567890123456789012345678901234567890', uri: 'ipfs://fakeuri1' },
    { address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', uri: 'ipfs://fakeuri2' },
    { address: '0x9876543210987654321098765432109876543210', uri: 'ipfs://fakeuri3' },
  ];

  for (const cert of recipients) {
    console.log(`🎓 Minting cert to ${cert.address}...`);
    const hash = await walletClient.writeContract({
      abi: contractJson.abi,
      address: contractAddress,
      functionName: 'issueCertificate',
      args: [cert.address as `0x${string}`, cert.uri],
      account,
    });

    console.log(`✅ Tx Hash for ${cert.address}: ${hash}`);
  }
}

main().catch((err) => {
  console.error('❌ Faux minting failed:', err);
  process.exit(1);
});
