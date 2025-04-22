"use client";

import { useState } from "react";
import { usePublicClient } from "wagmi";
import { parseAbi, isAddress, type Address } from "viem";

const contractAddress = process.env.NEXT_PUBLIC_CERTIFICATE_CONTRACT_ADDRESS as Address;

const abi = parseAbi([
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
]);

function resolveIpfsUrl(ipfsUrl: string): string {
  return ipfsUrl.startsWith("ipfs://")
    ? ipfsUrl.replace("ipfs://", "https://ipfs.io/ipfs/")
    : ipfsUrl;
}

export default function CertificateByAddressPage() {
  const publicClient = usePublicClient();
  const [address, setAddress] = useState("");
  const [certificates, setCertificates] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCertificates = async () => {
    if (!publicClient || !address) return;

    if (!isAddress(address)) {
      setError("❌ Invalid Ethereum address.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setCertificates([]);

    const MAX_TOKEN_ID = 50; // normally use Enumerable on a new version of the contract but problem of time to implement 
    const certs: any[] = [];

    try {
      for (let tokenId = 1; tokenId <= MAX_TOKEN_ID; tokenId++) {
        try {
          const owner: Address = await publicClient.readContract({
            address: contractAddress,
            abi,
            functionName: "ownerOf",
            args: [BigInt(tokenId)],
          });

          if (owner.toLowerCase() === address.toLowerCase()) {
            const tokenURI = await publicClient.readContract({
              address: contractAddress,
              abi,
              functionName: "tokenURI",
              args: [BigInt(tokenId)],
            });

            const resolved = resolveIpfsUrl(tokenURI as string);
            const res = await fetch(resolved);
            const json = await res.json();

            certs.push({
              tokenId: tokenId.toString(),
              uri: tokenURI,
              name: json.name,
              description: json.description,
              image: json.image,
            });
          }
        } catch {
          // Ignore: ownerOf peut throw si token non-minté ou burné
          continue;
        }
      }

      if (certs.length === 0) {
        setError("ℹ️ No certificates found for this address.");
      }

      setCertificates(certs);
    } catch (err) {
      console.error(err);
      setError("❌ Failed to fetch certificates.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto mt-6 border rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">🔍 Certificates by Address</h2>

      <input
        type="text"
        placeholder="Enter Ethereum address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <button
        onClick={fetchCertificates}
        disabled={isLoading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {isLoading ? "Fetching..." : "Show Certificates"}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {certificates.length > 0 && (
        <div className="mt-6 space-y-6">
          {certificates.map((cert) => (
            <div key={cert.tokenId} className="border p-4 rounded shadow-sm">
              <p><strong>Token ID:</strong> {cert.tokenId}</p>
              <p><strong>Name:</strong> {cert.name}</p>
              <p><strong>Description:</strong> {cert.description}</p>
              {cert.image && (
                <img
                  src={resolveIpfsUrl(cert.image)}
                  alt="Certificate"
                  className="rounded mt-2 max-w-full"
                />
              )}
              <p className="mt-2 text-sm break-all">
                <strong>URI:</strong>{" "}
                <a href={resolveIpfsUrl(cert.uri)} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  {cert.uri}
                </a>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
