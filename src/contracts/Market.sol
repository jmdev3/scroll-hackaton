// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IERC20 {
  function transfer(address to, uint256 amount) external returns (bool);
  function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

library SafeERC20 {
  function safeTransfer(IERC20 token, address to, uint256 amount) internal {
    bool ok = token.transfer(to, amount);
    require(ok, "SafeERC20: transfer failed");
  }
  function safeTransferFrom(IERC20 token, address from, address to, uint256 amount) internal {
    bool ok = token.transferFrom(from, to, amount);
    require(ok, "SafeERC20: transferFrom failed");
  }
}

contract Market {
  using SafeERC20 for IERC20;

  enum Outcome {
    YES,
    NO
  }

  struct MarketInfo {
    address owner;
    string question;
    IERC20 collateral; // USDC token
    uint256 totalYesShares;
    uint256 totalNoShares;
    uint256 totalBalance; // total USDC deposited
    Outcome result;
    bool resolved;
  }

  MarketInfo[] public markets;

  // marketId => isYes => account => shares
  mapping(uint256 => mapping(bool => mapping(address => uint256))) public shares;

  event MarketCreated(uint256 indexed marketId, address indexed owner, string question);
  event BetPlaced(uint256 indexed marketId, address indexed bettor, bool isYes, uint256 shares);
  event MarketSolved(uint256 indexed marketId, address indexed solver, Outcome result);
  event MarketSettled(uint256 indexed marketId, address indexed winner, uint256 payout);

  /**
   * @notice Create a new market
   */
  function createMarket(string calldata question, IERC20 collateral) external returns (uint256) {
    require(address(collateral) != address(0), "zero collateral");

    markets.push();
    uint256 id = markets.length - 1;
    MarketInfo storage m = markets[id];
    m.owner = msg.sender;
    m.question = question;
    m.collateral = collateral;
    m.totalYesShares = 0;
    m.totalNoShares = 0;
    m.totalBalance = 0;
    m.resolved = false;

    emit MarketCreated(id, msg.sender, question);
    return id;
  }

  /**
   * @notice Place a bet - takes 1 USDC and stores 1 virtual share
   * @param marketId The market ID
   * @param isYes true for YES bet, false for NO bet
   */
  function placeBet(uint256 marketId, bool isYes, uint256 betAmount) external {
    MarketInfo storage m = markets[marketId];
    require(m.owner != address(0), "market does not exist");
    require(!m.resolved, "market already resolved");

    // Transfer betAmount from user to contract
    m.collateral.safeTransferFrom(msg.sender, address(this), betAmount);

    // Update accounting
    m.totalBalance += betAmount;

    // Give user 1 virtual share
    if (isYes) {
      m.totalYesShares += betAmount;
      shares[marketId][true][msg.sender] += betAmount;
    } else {
      m.totalNoShares += betAmount;
      shares[marketId][false][msg.sender] += betAmount;
    }

    emit BetPlaced(marketId, msg.sender, isYes, betAmount);
  }

  /**
   * @notice Solve the market (only owner can solve)
   * @param marketId The market ID
   * @param result YES or NO outcome
   */
  function solveMarket(uint256 marketId, Outcome result) external {
    MarketInfo storage m = markets[marketId];
    require(m.owner != address(0), "market does not exist");
    require(msg.sender == m.owner, "only owner can solve");
    require(!m.resolved, "market already resolved");
    require(result == Outcome.YES || result == Outcome.NO, "invalid outcome");

    m.result = result;
    m.resolved = true;

    emit MarketSolved(marketId, msg.sender, result);
  }

  /**
   * @notice Settle the market - redistribute balance to winners (anyone can call, but only if resolved)
   * Each winner calls this to claim their proportional share of the total balance
   * @param marketId The market ID
   */
  function settle(uint256 marketId) external {
    MarketInfo storage m = markets[marketId];
    require(m.owner != address(0), "market does not exist");
    require(m.resolved, "market must be solved first");
    require(m.totalBalance > 0, "no balance to distribute");

    Outcome winningOutcome = m.result;
    bool isYesWinner = (winningOutcome == Outcome.YES);
    uint256 totalWinningShares = isYesWinner ? m.totalYesShares : m.totalNoShares;

    require(totalWinningShares > 0, "no winners");

    // Check caller's winning shares
    uint256 callerShares = shares[marketId][isYesWinner][msg.sender];
    require(callerShares > 0, "no winning shares to claim");

    // Calculate proportional payout based on total balance: (totalBalance * callerShares) / totalWinningShares
    uint256 calculatedPayout = (m.totalBalance * callerShares) / totalWinningShares;
    require(calculatedPayout > 0, "zero payout");

    // Safety check: don't transfer more than available (shouldn't happen due to rounding, but be safe)
    uint256 callerPayout = calculatedPayout > m.totalBalance ? m.totalBalance : calculatedPayout;

    // Clear caller's shares
    shares[marketId][isYesWinner][msg.sender] = 0;

    // Update total balance and transfer
    m.totalBalance -= callerPayout;
    m.collateral.safeTransfer(msg.sender, callerPayout);

    emit MarketSettled(marketId, msg.sender, callerPayout);
  }

  /**
   * @notice Get number of markets
   */
  function getMarketsCount() external view returns (uint256) {
    return markets.length;
  }

  /**
   * @notice Get user's shares for a market
   */
  function getUserShares(
    uint256 marketId,
    address user,
    bool isYes
  ) external view returns (uint256) {
    return shares[marketId][isYes][user];
  }

  /**
   * @notice Get MarketInfo details by market ID
   */
  function getMarketById(
    uint256 marketId
  )
    external
    view
    returns (
      address owner,
      string memory question,
      IERC20 collateral,
      uint256 totalYesShares,
      uint256 totalNoShares,
      uint256 totalBalance,
      Outcome result,
      bool resolved
    )
  {
    require(marketId < markets.length, "Market does not exist");
    MarketInfo storage m = markets[marketId];
    return (
      m.owner,
      m.question,
      m.collateral,
      m.totalYesShares,
      m.totalNoShares,
      m.totalBalance,
      m.result,
      m.resolved
    );
  }
}
