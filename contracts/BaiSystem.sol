pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "./Liquidatable.sol";

contract BaiSystem is Liquidatable {
    
    // address constant COLLATERAL_ADDRESS = 0xdCad3a6d3569DF655070DEd06cb7A1b2Ccd1D3AF; // DAI
    string constant SYNTHETIC_NAME = "BAI Stablecoin";
    string constant SYNTHETIC_SYMBOL = "BAI";
    uint256 constant LIQUIDATION_RATIO = 1050000; // 1.05
    uint256 constant LIQUIDATION_INCENTIVE = 30000; // 0.03

    constructor(
        address collateralAddress,
        address oracleAddress,
        address tokenFactoryAddress
    )
        public
        Liquidatable(
            collateralAddress,
            oracleAddress,
            SYNTHETIC_NAME,
            SYNTHETIC_SYMBOL,
            tokenFactoryAddress,
            LIQUIDATION_RATIO,
            LIQUIDATION_INCENTIVE
        )
    {

    }
}