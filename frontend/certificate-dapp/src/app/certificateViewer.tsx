"use client";

import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { parseAbi, type Address } from "viem";

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

export default function CertificateViewer() {
  console.log("✅ Render React client-side");

  const [tokenId, setTokenId] = useState("");
  const [shouldFetch, setShouldFetch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [owner, setOwner] = useState<Address | null>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<{
    name?: string;
    description?: string;
    image?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const publicClient = usePublicClient();

  useEffect(() => {
    const fetchData = async () => {
      if (!publicClient || !tokenId || isNaN(Number(tokenId))) return;

      setIsLoading(true);

      try {
        const tokenIdBigInt = BigInt(tokenId);

        const ownerResult = await publicClient.readContract({
          address: contractAddress,
          abi,
          functionName: "ownerOf",
          args: [tokenIdBigInt],
        });

        const uriResult = await publicClient.readContract({
          address: contractAddress,
          abi,
          functionName: "tokenURI",
          args: [tokenIdBigInt],
        });

        setOwner(ownerResult?.toString() as Address);
        setUri(uriResult as string);
        setError(null);
        setMetadata(null);

        if (uriResult) {
          const resolved = resolveIpfsUrl(uriResult as string);
          const res = await fetch(resolved);
          const json = await res.json();
          console.log("Fetched metadata:", json);
          console.log("Resolved image URL:", resolveIpfsUrl(json.image));

          setMetadata({
            name: json.name,
            description: json.description,
            image: json.image,
          });
        }
      } catch (err: any) {
        setOwner(null);
        setUri(null);
        setMetadata(null);
        setError("❌ Certificate not found or invalid token ID");
      } finally {
        setShouldFetch(false);
        setIsLoading(false);
      }
    };

    if (shouldFetch && publicClient) fetchData();
  }, [shouldFetch, tokenId, publicClient]);

  return (
    <div className="p-4 border rounded-xl max-w-2xl mx-auto mt-6 shadow">
      <h2 className="text-xl font-bold mb-4">🔍 Certificate Lookup</h2>

      <input
        type="text"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
        placeholder="Enter token ID"
        className="border p-2 w-full mb-4"
      />

      <button
        onClick={() => setShouldFetch(true)}
        className={`px-4 py-2 rounded w-full text-white ${
          isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Show Certificate"}
      </button>

      {owner && uri && (
        <div className="mt-4 text-sm">
          <p><strong>Owner:</strong> {owner}</p>
          <p><strong>NFT Contract:</strong> {contractAddress}</p>


          <p className="mb-2">
            <strong>URI:</strong>{" "}
            <a
              href={resolveIpfsUrl(uri)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline break-all"
            >
              {uri}
            </a>
          </p>

          {(uri.endsWith(".jpg") || uri.endsWith(".png") || uri.endsWith(".jpeg") || uri.endsWith(".gif")) && (
            <img
              src={resolveIpfsUrl(uri)}
              alt="Certificate"
              className="rounded mt-2 max-w-full"
            />
          )}

          {metadata && (
            <div className="mt-4 border-t pt-4 text-sm">
              {metadata.name && <p><strong>Name:</strong> {metadata.name}</p>}
              {metadata.description && <p><strong>Description:</strong> {metadata.description}</p>}
              {metadata.image && (
                <div className="mt-2">
                  <img
                    src={resolveIpfsUrl(metadata.image)}
                    alt={metadata.name || "Image"}
                    className="rounded max-w-full"
                  />
                </div>
              )}
            </div>
          )}

          {!metadata && (
            <p>
              <a
                href={resolveIpfsUrl(uri)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 underline"
              >
                Open Certificate Content
              </a>
            </p>
          )}
        </div>
      )}

      {error && (
        <p className="text-red-600 mt-4">{error}</p>
      )}
    </div>
  );
}
