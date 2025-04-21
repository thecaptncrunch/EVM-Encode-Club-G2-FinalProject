"use client";

import { useEffect, useState } from "react";
import { useAccount, usePublicClient, useReadContract, useWalletClient } from "wagmi";
import { toBytes, isAddress, parseAbi, WalletClient, type Address } from "viem";

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
const [tokenID, settokenID] = useState("");
const [isLoading, setIsLoading] = useState(false);
const [isOwner, setisOwner] = useState<boolean | null>(null);
const [error, setError] = useState<string | null>(null);

// State variables that allow you to interact with WAGMI/Viem
const { data: walletClient } = useWalletClient();
const publicClient = usePublicClient();

// Identifying the owner of the contract using viem
    const {data: contractAdmin} = useReadContract({
        address: contractAddress,
        abi,
        functionName: "hasRole",
        args: [toBytes("ADMIN_ROLE"), userAddress],
    });

// Updates the isOwner state variable to the contractOwner variable
// Will fail if a) the userAddress or contractOwner variables are not available, b) if userAddress does not match contractOwner
    useEffect(() => {
        if (contractAdmin != true) return;
        setisOwner(true);
    }, [userAddress, contractAdmin]);

// Runs the actual mint using the component
const revoke = async () => {

// Clears previous error messages
            setError(null);
    
// Checks isOwner state variable, sets error for any other address         
            if (!isOwner) {
                setError ("Only the contract owner can mint certificates.");
                return;
            }
            
//converts tokenID to a bigint
const tokenIDBIGINT = BigInt(tokenID);

// Ensures that tokenID is not null
            if (tokenID == null) {
                return;
            }
// Attempts to call the contract and revoke a certificate with the required arguments
// Issues a success message in console if transaction clears
            try {
            const txhash = await walletClient?.writeContract({
                address: contractAddress,
                abi,
                functionName: "revokeCertificate",
                args: [tokenIDBIGINT],
                account: userAddress, 
                });

            console.log("Certificate revoked successfully. Transaction Hash:", txhash); 
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
        onChange={(e) => settokenID(e.target.value)}
        className="border p-2 w-full mb-4"
        />
            
    <button
        onClick={revoke}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
        Revoke Certificate
    </button>
            
    {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
        );
    }