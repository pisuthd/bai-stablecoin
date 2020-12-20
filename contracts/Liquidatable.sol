pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "./utility/SafeMath.sol";
import "./PositionManager.sol";

contract Liquidatable is PositionManager {
    using SafeMath for uint256;

    // Liquidation Incentive Fee in PPM (1.0 = 1000000)
    uint256 public liquidationIncentive;

    event PositionLiquidated(address indexed sponsor, address indexed liquidator, uint256 tokenAmount, uint256 payToSponser, uint256 payToLiquidator);

    constructor(
        address _collateralAddress,
        address _oracleAddress,
        string memory _syntheticName,
        string memory _syntheticSymbol,
        address _tokenFactoryAddress,
        uint256 _liquidationRatio,
        uint256 _liquidationIncentive
    )
        public
        PositionManager(
            _collateralAddress,
            _oracleAddress,
            _syntheticName,
            _syntheticSymbol,
            _tokenFactoryAddress,
            _liquidationRatio
        )
        nonReentrant()
    {
        require(
            _liquidationRatio > 1000000,
            "Liquidation ratio need to be > 100%"
        );

        // Set liquidatable specific variables.
        liquidationIncentive = _liquidationIncentive;
    }

    function liquidate(address sponsor, uint256 numTokens)
        external
        nonReentrant()
    {
        // Retrieve Position data for sponsor
        PositionData storage positionToLiquidate = _getPositionData(sponsor);
        require(
            _checkCollateralization(
                positionToLiquidate.rawCollateral,
                positionToLiquidate.tokensOutstanding
            ) == false,
            "Position above than liquidation ratio"
        );
        require(
            positionToLiquidate.tokensOutstanding == numTokens,
            "Amount is invalid"
        );

        // Pay SPONSOR - Penalty fee 
        uint256 remainingCollateral = positionToLiquidate.rawCollateral;
        uint256 penaltyFee = remainingCollateral.mul(liquidationIncentive).div(1000000);
        uint256 payToSponser = remainingCollateral.sub(penaltyFee);
        
        _deleteSponsorPosition(sponsor);

        uint256 totalBurnt = positionToLiquidate.tokensOutstanding;
        collateralCurrency.transfer(sponsor, payToSponser);

        // Pay LIQUIDATOR + Incentives
        uint256 payToLiquidator = _calculateCollateralRedeemed(numTokens);
        payToLiquidator = payToLiquidator.add(penaltyFee);

        tokenCurrency.transferFrom(msg.sender, address(this), numTokens);
        collateralCurrency.transfer(msg.sender, payToLiquidator);
        
        tokenCurrency.burn(totalBurnt);

        emit PositionLiquidated(sponsor, msg.sender , numTokens , payToSponser,payToLiquidator);

    }
    
}
