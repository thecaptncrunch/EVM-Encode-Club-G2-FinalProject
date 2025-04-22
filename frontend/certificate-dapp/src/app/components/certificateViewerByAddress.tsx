"use client";

import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { parseAbi, type Address, isAddress } from "viem";

const contractAddress = process.env.NEXT_PUBLIC_CERTIFICATE_CONTRACT_ADDRESS as Address;

const abi = parseAbi([
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
]);

function resolveIpfsUrl(ipfsUrl: string): string {
  return ipfsUrl.startsWith("ipfs://")
    ? ipfsUrl.replace("ipfs://", "https://ipfs.io/ipfs/")
    : ipfsUrl;
}

export default function CertificateViewerByAddress() {
  const [userAddress, setUserAddress] = useState("");
  const [certificates, setCertificates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const publicClient = usePublicClient();

  const fetchCertificates = async () => {
    if (!publicClient || !userAddress || !isAddress(userAddress)) {
      setError("Please enter a valid Ethereum address.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setCertificates([]);

    try {
      const balance: bigint = await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "balanceOf",
        args: [userAddress as Address],
      });

      const tokenIds: bigint[] = [];
      for (let i = 0n; i < balance; i++) {
        const tokenId: bigint = await publicClient.readContract({
          address: contractAddress,
          abi,
          functionName: "tokenOfOwnerByIndex",
          args: [userAddress as Address, i],
        });
        tokenIds.push(tokenId);
      }

      const results = await Promise.all(
        tokenIds.map(async (tokenId) => {
          const uri: string = await publicClient.readContract({
            address: contractAddress,
            abi,
            functionName: "tokenURI",
            args: [tokenId],
          });
          const resolvedUri = resolveIpfsUrl(uri);
          const res = await fetch(resolvedUri);
          const metadata = await res.json();

          return { tokenId: tokenId.toString(), uri, metadata };
        })
      );

      setCertificates(results);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch certificates. Make sure the address is correct and the contract is enumerable.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-xl max-w-2xl mx-auto mt-6 shadow">
      <h2 className="text-xl font-bold mb-4">🔍 View Certificates by Address</h2>

      <input
        type="text"
        value={userAddress}
        onChange={(e) => setUserAddress(e.target.value)}
        placeholder="Enter Ethereum address"
        className="border p-2 w-full mb-4"
      />

      <button
        onClick={fetchCertificates}
        className={`px-4 py-2 rounded w-full text-white ${
          isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Show Certificates"}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {certificates.length > 0 && (
        <div className="mt-6 space-y-6">
          {certificates.map((cert, index) => (
            <div key={index} className="border p-4 rounded shadow">
              <p><strong>Token ID:</strong> {cert.tokenId}</p>
              <p><strong>URI:</strong> <a href={resolveIpfsUrl(cert.uri)} target="_blank" className="text-blue-600 underline break-all">{cert.uri}</a></p>
              <p><strong>Name:</strong> {cert.metadata.name}</p>
              <p><strong>Description:</strong> {cert.metadata.description}</p>
              {cert.metadata.image && (
                <img
                  src={resolveIpfsUrl(cert.metadata.image)}
                  alt={cert.metadata.name || "Certificate Image"}
                  className="mt-2 rounded max-w-full"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}