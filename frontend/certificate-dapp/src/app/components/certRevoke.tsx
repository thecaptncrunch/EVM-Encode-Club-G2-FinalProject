"use client";

import { useEffect, useState } from "react";
import { useAccount, usePublicClient, useReadContract, useWalletClient } from "wagmi";
import { toBytes, isAddress, parseAbi, WalletClient, type Address, keccak256, toHex } from "viem";

const contractAddress = process.env.NEXT_PUBLIC_CERTIFICATE_CONTRACT_ADDRESS as Address;

// Identify which functions I will be using in this page and modify them so they can be used by WAGMI
const abi = parseAbi([
    'function revokeCertificate(uint256 tokenID)',
    'function hasRole(bytes32 role, address account) view returns (bool)',
]);

// The function logic for React
export default function AdminRevoke() {
    console.log("✅ Render React client-side");

// State variables that will be initialized when this function is called
const {address: userAddress} = useAccount();
const [tokenID, setTokenID] = useState("");
const [isLoading, setIsLoading] = useState(false);
const [isOwner, setIsOwner] = useState<boolean | null>(null);
const [error, setError] = useState<string | null>(null);
const [successMessage, setSuccessMessage] = useState<string | null>(null);


// State variables that allow you to interact with WAGMI/Viem
const { data: walletClient } = useWalletClient();
const publicClient = usePublicClient();


  

// Identifying the owner of the contract using viem
const ADMIN_ROLE = keccak256(toHex("ADMIN_ROLE"));

const {data: contractAdmin} = useReadContract({
    address: contractAddress,
    abi,
    functionName: "hasRole",
    args: [ADMIN_ROLE, userAddress!],
});

// Updates the isOwner state variable to the contractOwner variable
// Will fail if a) the userAddress or contractOwner variables are not available, b) if userAddress does not match contractOwner
    useEffect(() => {
        if (contractAdmin === false) {
        setError("You are not authorized to revoke certificates.");
        setIsOwner(false);
        } else if (contractAdmin === true) {
        setIsOwner(true);
        }
  }, [userAddress, contractAdmin]);

// Runs the actual mint using the component
const revoke = async () => {

// Clears previous error messages
            setError(null);
            setSuccessMessage(null);


            if (!walletClient) {
                setError("Wallet client not available.");
                return;
              }
    
// Checks isOwner state variable, sets error for any other address         
            if (!isOwner) {
                setError ("Only the contract owner can revoke certificates.");
                return;
            }
            
//converts tokenID to a bigint
const tokenIdBIGINT = BigInt(tokenID);

// Ensures that tokenID is not null
if (!tokenID || isNaN(Number(tokenID))) {
    setError("Please enter a valid token ID.");
    return;
  }


// Attempts to call the contract and revoke a certificate with the required arguments
// Issues a success message in console if transaction clears
            try {
            const txhash = await walletClient?.writeContract({
                address: contractAddress,
                abi,
                functionName: "revokeCertificate",
                args: [tokenIdBIGINT],
                account: userAddress, 
                });

            console.log("Certificate revoked successfully. Transaction Hash:", txhash); 
            setSuccessMessage(`✅ Certificate ${tokenID} revoked successfully. Tx hash: ${txhash}`);
            setTokenID(""); // empty field

                }
            
            catch (err) {
                console.error("Unable to revoke certificate. ", err);
                setError("Something went wrong while revoking certificate.");
                }
            };
            
return (
    <div className="p-6 border rounded-xl max-w-xl mx-auto mt-6 shadow">
    <h2 className="text-xl font-bold mb-4">Revoke Certificate</h2>
            
    <input
        type="text"
        placeholder="tokenID"
        value={tokenID}
        onChange={(e) => setTokenID(e.target.value)}
        className="border p-2 w-full mb-4"
        />
            
    <button
        onClick={revoke}
        disabled={isLoading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
        {isLoading ? "Revoking..." : "Revoke Certificate"}
    </button>
            
    {error && <p className="text-red-600 mt-4">{error}</p>}
    {successMessage && <p className="text-green-600 mt-4">{successMessage}</p>}

    </div>
        );
    }