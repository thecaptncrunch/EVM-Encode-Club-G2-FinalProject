// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721URIStorage, ERC721} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract CertificateNFT is ERC721URIStorage, AccessControl {
    uint256 private _nextTokenId = 1;
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    /// @notice Set the token name and symbol, and assign ownership
    constructor(address initialAdmin)
        ERC721("CertificateNFT", "CERT")
    {
        _grantRole(DEFAULT_ADMIN_ROLE, initialAdmin); // Super admin
        _grantRole(ADMIN_ROLE, initialAdmin);         // First admin
    }

    /// @notice Only the owner (admin) can issue certificates
    function issueCertificate(address to, string memory certURI) external onlyRole(ADMIN_ROLE) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, certURI);
    }

    /// @notice Admin can revoke (burn) a certificate
    function revokeCertificate(uint256 tokenId) external onlyRole(ADMIN_ROLE) {
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

    function addAdmin(address newAdmin) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(ADMIN_ROLE, newAdmin);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(AccessControl, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
