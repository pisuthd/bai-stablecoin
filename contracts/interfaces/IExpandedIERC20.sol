pragma solidity ^0.6.0;

import "./IERC20.sol";


/**
 * @title ERC20 interface that includes burn and mint methods.
 */
abstract contract IExpandedIERC20 is IERC20 {
    /**
     * @notice Burns a specific amount of the caller's tokens.
     * @dev Only burns the caller's tokens, so it is safe to leave this method permissionless.
     */
    function burn(uint256 value) external virtual;

    /**
     * @notice Mints tokens and adds them to the balance of the `to` address.
     * @dev This method should be permissioned to only allow designated parties to mint tokens.
     */
    function mint(address to, uint256 value) external virtual returns (bool);
}
