# 🎓 CertificateNFT – Soulbound Certification System

Final project – Encode Club Solidity Bootcamp (Group 2, Q1 2025)

## 🧠 Description

This project is a certification system based on non-transferable NFTs (Soulbound Tokens). Each certificate is issued as an ERC-721 NFT, with metadata hosted on IPFS via Pinata. Only an administrator can issue and revoke certificates.

---

## 📁 Project Structure

## ⚙️ Features

### 🔐 `CertificateNFT` Contract
- Inherits from `ERC721URIStorage`
- Soulbound (non-transferable NFT)
- Admin-only minting
- Revocation via `burn`
- Metadata stored on IPFS (via Pinata)

### 🌐 Frontend
- View certificate by token ID
- Display owner and metadata URI
- Wallet connect (RainbowKit)
- *(Coming soon)* Admin UI to issue certificates