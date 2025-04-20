// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721URIStorage, ERC721} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CertificateNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId = 1;

    /// @notice Set the token name and symbol, and assign ownership
    constructor(address initialOwner)
        ERC721("CertificateNFT", "CERT")
        Ownable(initialOwner)
    {}

    /// @notice Only the owner (admin) can issue certificates
    function issueCertificate(address to, string memory certURI) external onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, certURI);
    }

    /// @notice Admin can revoke (burn) a certificate
    function revokeCertificate(uint256 tokenId) external onlyOwner {
        _burn(tokenId);
    }

    /// @notice Prevent transfers except minting (from 0) and burning (to 0)
    function _update(
        address to,
        uint256 tokenId,
        address auth
    )
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        require(from == address(0) || to == address(0), "Soulbound: non-transferable");
        return super._update(to, tokenId, auth);
    }
}
