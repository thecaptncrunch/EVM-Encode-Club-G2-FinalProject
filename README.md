# 🎓 CertificateNFT – Soulbound NFT Certificate System

This project implements a non-transferable (Soulbound) NFT-based certification system using Solidity, IPFS (via Pinata), and a full-stack dApp built with Next.js, Wagmi v2, and Viem.

---

## 📚 Table of Contents

- [✨ Features](#-features)
- [📦 Smart Contract](#-smart-contract)
  - [✅ Inheritance](#-inheritance)
  - [✅ Soulbound Logic](#-soulbound-logic)
  - [✅ Admin Functions](#-admin-functions)
  - [✅ URI Management](#-uri-management)
- [🖼 Metadata & IPFS](#-metadata--ipfs)
- [💻 Frontend Application](#-frontend-application)
- [🚀 Deployment](#-deployment)
- [🧪 End-to-End Testing](#-end-to-end-testing)
- [🔐 Roles](#-roles)
- [📁 Project Structure](#-project-structure)
- [📜 License](#-license)
- [🙌 Acknowledgements](#-acknowledgements)

---

## ✨ Features

- **Soulbound NFT**: Certificates are ERC-721 tokens that cannot be transferred.
- **Admin-Only Minting**: Only admins can issue or revoke certificates.
- **IPFS Metadata**: Certificate metadata is uploaded to IPFS (via Pinata).
- **Frontend dApp**:
  - Admin panel to issue certificates.
  - Public verification by wallet address or token ID.
- **Testnet Deployed**: Smart contract is live on Sepolia.

---

## 📦 Smart Contract

### ✅ Inheritance

The contract extends:

- `ERC721`: NFT standard.
- `ERC721URIStorage`: for per-token metadata management.
- `AccessControl`: to manage roles (`ADMIN_ROLE`, etc.).

```solidity
contract CertificateNFT is ERC721, ERC721URIStorage, AccessControl {
    // ...
}
```

---

### ✅ Soulbound Logic

Transfers are restricted by overriding `_beforeTokenTransfer`:

```solidity
function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
    internal
    override
{
    require(from == address(0) || to == address(0), "Non-transferable token");
    super._beforeTokenTransfer(from, to, tokenId, batchSize);
}
```

---

### ✅ Admin Functions

```solidity
function issueCertificate(address to, string memory tokenURI) public onlyRole(ADMIN_ROLE);

function revokeCertificate(uint256 tokenId) public onlyRole(ADMIN_ROLE);
```

---

### ✅ URI Management

```solidity
function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
}

function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
}
```

---

## 🖼 Metadata & IPFS

Each certificate stores a `tokenURI` pointing to metadata on IPFS (uploaded via Pinata). The metadata typically includes:

- Recipient name
- Certificate title or course
- Issuance date
- Link to official PDF or image

---

## 💻 Frontend Application

Built with **Next.js**, **Wagmi v2**, and **viem**.

### Admin Interface
- Connects to wallet with `ADMIN_ROLE`
- Issues certificates via contract function

### Public Interface
- Search and view certificates by:
  - Wallet address
  - Token ID
- Displays metadata (fetched via `tokenURI`)

---

## 🚀 Deployment

- **Network**: Sepolia Testnet
- **Smart Contract**: Deployed using viem and dotenv
- **Frontend**: Can be deployed locally or on Vercel

---

## 🧪 End-to-End Testing

- ✅ Certificate minting by admin
- ✅ Metadata stored and accessible via IPFS
- ✅ Metadata viewable via public frontend
- ✅ Token transfer fails (as expected for Soulbound logic)

---

## 🔐 Roles

- `DEFAULT_ADMIN_ROLE`: Contract deployer
- `ADMIN_ROLE`: Can issue and revoke certificates

Grant new admins using:

```solidity
grantRole(ADMIN_ROLE, address);
```

---

## 📁 Project Structure

```
contracts/
  CertificateNFT.sol

frontend/
  components/
    certificateViewer.tsx
    certificateViewerByAddress.tsx
    certMinter.tsx
    certRevoke.tsx
    navbar.tsx

scripts/
  addAmin.ts
  certificateDeployWithViem.ts
  checkCertificate.ts
  fauxmint.ts
  isAdmin.ts
  listAllCertificates.ts
  mintWithViem.ts
  revokeCertificate.ts

.env
.env.local
```

---

## 📜 License

MIT License

---

## 🙌 Acknowledgements

- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Wagmi](https://wagmi.sh/)
- [Pinata](https://www.pinata.cloud/)
- [Encode Solidity Bootcamp](https://encode.club)
