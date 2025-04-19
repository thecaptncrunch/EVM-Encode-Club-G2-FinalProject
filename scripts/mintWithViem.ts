import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import { writeContract } from 'viem/actions';
import dotenv from 'dotenv';
import contractJson from '../artifacts/contracts/CertificateNFT.sol/CertificateNFT.json';

dotenv.config();

async function main() {
  const contractAddress = process.env.NFT_Key as `0x${string}`;
  if (!contractAddress) {
    throw new Error("❌ Missing NFT_Key in .env");    
  }
  const contractAddressTyped = contractAddress as `0x${string}`;


  const recipient = "0x3B79764C76c5ae3c4B39a4049c53f512ee30eF3c" as `0x${string}`;
  const certURI = "ipfs://bafkreidt72f6igrbrgy2a5olgfkmdfwgypmooh6poskioilpxgmu2o3464";

  const privateKey = `0x${process.env.PRIVATE_KEY!}` as `0x${string}`;
  const account = privateKeyToAccount(privateKey);

  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(process.env.RPC_ENDPOINT_URL!)
  });

  console.log(`🧾 Minting certificate to ${recipient} with URI: ${certURI}`);

  const hash = await writeContract(walletClient, {
    abi: contractJson.abi,
    address: contractAddressTyped as `0x${string}`,
    functionName: 'issueCertificate',
    args: [recipient, certURI],
    account,
  });

  console.log('✅ Transaction hash:', hash);
}

main().catch((err) => {
  console.error('❌ Mint failed:', err);
  process.exit(1);
});
