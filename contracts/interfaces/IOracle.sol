pragma solidity ^0.6.0;

interface IOracle {

    function getValue() external view returns (uint256);

}