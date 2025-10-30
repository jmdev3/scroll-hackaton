// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract USDC is ERC20, Ownable {
  constructor(uint256 initialSupply) ERC20("USD Coin", "USDC") Ownable(msg.sender) {
    _mint(msg.sender, initialSupply);
  }

  // Keep USDC-like decimals
  function decimals() public pure override returns (uint8) {
    return 6;
  }

  // Mint function restricted to owner
  function mint(address to, uint256 amount) external onlyOwner {
    _mint(to, amount);
  }
}
