"use client";

import { useEffect, useState } from "react";
import { useAccount, usePublicClient, useReadContract, useWalletClient } from "wagmi";
import { toBytes, isAddress, parseAbi, stringToBytes, WalletClient, type Address, keccak256, toHex } from "viem";

const contractAddress = process.env.NEXT_PUBLIC_CERTIFICATE_CONTRACT_ADDRESS as Address;

// Identify which functions I will be using in this page and modify them so they can be used by WAGMI
const abi = parseAbi([
    'function issueCertificate(address to, string memory certURI)',
    'function hasRole(bytes32 role, address account) view returns (bool)',
]);

// The function logic for React
export default function AdminMinter() {
    //console.log("✅ Render React client-side");

// State variables that will be initialized when this function is called
    const {address: userAddress} = useAccount();
    const [recipient, setRecipient] = useState("");
    const [certURI, setcertURI] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOwner, setisOwner] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [ipfsCID, setIpfsCID] = useState<string>("");



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

    //console.log("contractAdmin:", contractAdmin);
    //console.log("isOwner:", isOwner);


// Updates the isOwner state variable to the contractOwner variable
// Will fail if a) the userAddress or contractOwner variables are not available, b) if userAddress does not match contractOwner
    useEffect(() => {
      if (contractAdmin === true) {
        setisOwner(true);
      } else if (contractAdmin === false) {
        setisOwner(false);
      }
    }, [userAddress, contractAdmin]);

// Runs the actual mint using the component
    const mintActivities = async () => {

// Clears previous error messages
      setIsLoading(true);

      setError(null);

// Checks isOwner state variable, sets error for any other address         
        // if (!isOwner) {
        //     setError ("Only the contract ADMIN can mint certificates.");
        //     setIsLoading(false)
        //     return;
        // }

        if (!recipient || !isAddress(recipient)) {
          setError("Please enter a valid recipient address.");
          setIsLoading(false)
          return;
        }
        
      
        // Validate certURI format
        const isValidUri = (uri: string) => {
        try {
          // authorize also ipfs:// even if URL() don't directly support it
          if (uri.startsWith("ipfs://")) return true;
          new URL(uri); // vérifie http:// ou https://
          return true;
        } catch {
          setIsLoading(false)
          return false;
        }
        };

        if (!ipfsCID || ipfsCID.trim() === "") {
          setError("Please enter a valid IPFS CID.");
          setIsLoading(false)
          return;
        }
        
        const certURI = `ipfs://${ipfsCID}`;
        const gatewayURL = `https://ipfs.io/ipfs/${ipfsCID}`;

        try {
          const response = await fetch(gatewayURL);
        
          if (!response.ok) {
            alert("❌ Unable to fetch the URI. Status: " + response.status);
            setIsLoading(false);
            return;
          }
        
          const contentType = response.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            alert("❌ The URI does not return JSON data.");
            setIsLoading(false);
            return;
          }
        
          // Parse JSON to increase level of confidence
          try {
            await response.json(); // error here --> no valid JSON
          } catch (err) {
            alert("❌ The content at the URI is not a valid JSON.");
            setIsLoading(false);
            return;
          }
        } catch (err) {
          alert("❌ Failed to fetch URI. Network error or CORS.");
          setIsLoading(false);
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
        setSuccessMessage(`✅ Mint successful. Tx hash: ${txhash}`);
        setRecipient("");
        setIpfsCID("");

        }

// If an error occurs, issues error messages both in the console and in the UI
        catch (err) {
            console.error("Unable to mint. ", err);
            setError("Something went wrong while minting.");
            
        } finally {
          setIsLoading(false);
        }
      }


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
          placeholder="IPFS CID"
          value={ipfsCID}
          onChange={(e) => setIpfsCID(e.target.value)}
          className="border p-2 w-full mb-4"
        />
    
        <button
          onClick={mintActivities}
          disabled={isLoading || !isOwner}          
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {isLoading ? "Minting..." : "Mint NFT"}
        </button>
        {!isOwner && isOwner !== null && (
        <p className="text-red-600 mt-4">You are not authorized to mint certificates.</p>
)}
    
        {error && <p className="text-red-600 mt-4">{error}</p>}
    
        {successMessage && (
          <div className="text-green-600 mt-4 flex flex-col gap-2">
            <p>{successMessage}</p>
            <button
              onClick={() => {
                const hash = successMessage.split("Tx hash: ")[1];
                navigator.clipboard.writeText(hash);
              }}
              className="text-sm text-blue-700 underline hover:text-blue-900 w-fit"
            >
              📋 Copy transaction hash
            </button>
          </div>
        )}
      </div>
    );
        
}
