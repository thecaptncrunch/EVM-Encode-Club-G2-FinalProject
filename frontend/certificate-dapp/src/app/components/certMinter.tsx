"use client";

import { useEffect, useState } from "react";
import { useAccount, usePublicClient, useReadContract, useWalletClient } from "wagmi";
import { isAddress, parseAbi, WalletClient, type Address } from "viem";

const contractAddress = process.env.NEXT_PUBLIC_CERTIFICATE_CONTRACT_ADDRESS as Address;

// Identify which functions I will be using in this page and modify them so they can be used by WAGMI
const abi = parseAbi([
    'function issueCertificate(address to, string memory certURI)',
    'function owner() view returns (address)',
]);

// The function logic for React
export default function AdminMinter() {
    console.log("✅ Render React client-side");

// State variables that will be initialized when this function is called
    const {address: userAddress} = useAccount();
    const [recipient, setRecipient] = useState("");
    const [certURI, setcertURI] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOwner, setisOwner] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);

// State variables that allow you to interact with WAGMI/Viem
    const { data: walletClient } = useWalletClient();
    const publicClient = usePublicClient();

// Identifying the owner of the contract using viem
    const {data: contractOwner} = useReadContract({
        address: userAddress,
        abi,
        functionName: "owner"
    });

// Updates the isOwner state variable to the contractOwner variable
// Will fail if a) the userAddress or contractOwner variables are not available, b) if userAddress does not match contractOwner
    useEffect(() => {
        if (!userAddress || !contractOwner) return;
        setisOwner(userAddress.toLowerCase() == (contractOwner as Address).toLowerCase());
    }, [userAddress, contractOwner]);

// Runs the actual mint using the component
    const mintActivities = async () => {

// Clears previous error messages
        setError(null);

// Checks isOwner state variable, sets error for any other address         
        if (!isOwner) {
            setError ("Only the contract owner can mint certificates.");
            return;
        }

// Attempts to call the contract and issue a certificate with the required arguments
// Issues a success message in console if transaction clears
        try {
        const txhash = await walletClient?.writeContract({
            address: contractAddress,
            abi,
            functionName: "issueCertificate",
            args: [recipient as Address, certURI as string],
            account: userAddress, 
            });

        console.log("Mint Successful. Transaction Hash:", txhash); 
            }

// If an error occurs, issues error messages both in the console and in the UI
        catch (err) {
            console.error("Unable to mint. ", err);
            setError("Something went wrong while minting.");
            }
        };


  return (
    <div className="p-6 border rounded-xl max-w-xl mx-auto mt-6 shadow">
      <h2 className="text-xl font-bold mb-4">Issue Certificate</h2>

      <input
        type="text"
        placeholder="Recipient address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <input
        type="text"
        placeholder="Certificate URI"
        value={certURI ?? ""}
        onChange={(e) => setcertURI(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <button
        onClick={mintActivities}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Mint NFT
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}
