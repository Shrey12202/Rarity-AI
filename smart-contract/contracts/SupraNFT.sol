// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SupraNFT is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;

    constructor(string memory name, string memory symbol)
        ERC721(name, symbol)
        Ownable(msg.sender)
    {
        tokenCounter = 0;
    }

    function mintNFT(address recipient, string memory tokenURI) public onlyOwner returns (uint256) {
        uint256 newTokenId = tokenCounter;
        _mint(recipient, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        tokenCounter++;
        return newTokenId;
    }

    function getTokenIDs(address owner) public view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](balance);
        uint256 index = 0;
        
        for (uint256 i = 0; i < tokenCounter; i++) {
            if (ownerOf(i) == owner) {
                tokenIds[index] = i;
                index++;
            }
        }
        
        return tokenIds;
    }

    function getOwnedTokensMetadata(address owner) public view returns (string[] memory) {
        uint256[] memory tokenIds = getTokenIDs(owner);
        string[] memory tokenURIs = new string[](tokenIds.length);
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            tokenURIs[i] = tokenURI(tokenIds[i]);
        }
        
        return tokenURIs;
    }

    function transferNFT(address from, address to, uint256 tokenId) public {
        require(ownerOf(tokenId) == from, "ERC721: transfer from incorrect owner");
        require(msg.sender == from || msg.sender == getApproved(tokenId) || isApprovedForAll(from, msg.sender), "ERC721: caller is not token owner or approved");
        _transfer(from, to, tokenId);
    }
}
