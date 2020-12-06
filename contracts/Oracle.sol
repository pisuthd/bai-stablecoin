pragma solidity ^0.6.0;

import "./utility/Ownable.sol";
import "./interfaces/IOracle.sol"; 

contract Oracle is Ownable, IOracle {


    uint256 public value = 100000; // 0.1 USE PPM UNIT (1.0 equals to 1,000,000)
    uint256 public newValue = 100000; // 0.1 USE PPM UNIT (1.0 equals to 1,000,000)

    function updateValue(uint256 _newValue) public onlyOwner {
        newValue = _newValue;
    }

    function confirmValueUpdate() public onlyOwner {
        value = newValue;
    }

    function getValue() public view override returns (uint256) {
        return value;
    }
    
}