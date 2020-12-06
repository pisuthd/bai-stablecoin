pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "./interfaces/IPositionManager.sol";
import "./utility/SafeMath.sol";
import "./utility/Lockable.sol"; 
import "./interfaces/IERC20.sol";
import "./interfaces/IExpandedIERC20.sol";
import "./interfaces/IOracle.sol";
import "./TokenFactory.sol";

contract PositionManager is IPositionManager, Lockable {
    using SafeMath for uint256;

    struct PositionData {
        // Total tokens have been issued
        uint256 tokensOutstanding;
        // Raw collateral value.
        uint256 rawCollateral;
    }

    // Maps sponsor addresses to their positions. Each sponsor can have only one position.
    mapping(address => PositionData) public positions;

    // Keep track of the total collateral and tokens across all positions
    uint256 public totalTokensOutstanding;
    // Keep track of the raw collateral across all positions
    uint256 public rawTotalPositionCollateral;
    // Synthetic token created by this contract.
    IExpandedIERC20 public tokenCurrency;
    // Oracle
    IOracle public oracle;
    // The collateral currency used to back the positions in this contract.
    IERC20 public collateralCurrency;
    // collateralization ratio. (105%)
    uint256 public collateralizationRatio;

    /****************************************
     *          EVENTS          *
    ****************************************/
    event NewSponsor(address indexed sponsor);
    event PositionCreated(address indexed sponsor, uint256 indexed collateralAmount, uint256 indexed tokenAmount);
    event Deposit(address indexed sponsor, uint256 indexed collateralAmount);


    /**
     * @param _collateralAddress currency to be used as collateral
     * @param _oracleAddress address of the oracle contract
     * @param _syntheticName name of synthetic token to be created
     * @param _syntheticSymbol symbol of synthetic token to be created
     * @param _tokenFactoryAddress token factory contract address
     */
    constructor(
        address _collateralAddress,
        address _oracleAddress,
        string memory _syntheticName,
        string memory _syntheticSymbol,
        address _tokenFactoryAddress,
        uint256 _collateralizationRatio
    ) public nonReentrant() {
        TokenFactory tf = TokenFactory(_tokenFactoryAddress);
        tokenCurrency = tf.createToken(_syntheticName, _syntheticSymbol, 18);
        oracle = IOracle(_oracleAddress);
        collateralCurrency = IERC20(_collateralAddress);
        collateralizationRatio = _collateralizationRatio;
    }

    /**
     * @dev Creates tokens by creating a new position
     * @param collateralAmount total amount of collateral tokens to be sent to the sponsor's position.
     */
    function create(uint256 collateralAmount, uint256 numTokens)
        public
        nonReentrant() 
    {
        PositionData storage positionData = positions[msg.sender];
        // Position CR must be above the system CR.
        require(
            _checkCollateralization(collateralAmount, numTokens),
            "Position below than collateralization ratio"
        );

        if (positionData.tokensOutstanding == 0) {
            emit NewSponsor(msg.sender);
        }

        // Increase the position and global collateral balance by collateral amount.
        _incrementCollateralBalances(positionData, collateralAmount);

        // Add the number of tokens created to the position's outstanding tokens.
        positionData.tokensOutstanding = positionData.tokensOutstanding.add(numTokens);

        totalTokensOutstanding = totalTokensOutstanding.add(numTokens);

        emit PositionCreated(msg.sender, collateralAmount, numTokens);

        // Transfer tokens into the contract from caller and mint corresponding synthetic tokens to the caller's address.
        // FIXME: Use safeTransferFrom()
        collateralCurrency.transferFrom(msg.sender, address(this), collateralAmount);
        require(tokenCurrency.mint(msg.sender, numTokens), "Minting synthetic tokens failed");

    }

    /**
     * @dev Increases the collateralization level of a position after creation. This contract must be approved to spend
     * @param collateralAmount total amount of collateral tokens to be sent to the sponsor's position.
     */
    function deposit(uint256 collateralAmount) public nonReentrant() {
        require(collateralAmount > 0, "Invalid collateral amount");
        PositionData storage positionData = _getPositionData(msg.sender);

        // Increase the position and global collateral balance by collateral amount.
        _incrementCollateralBalances(positionData, collateralAmount);

        emit Deposit(msg.sender, collateralAmount);

        // Move collateral currency from sender to contract.
        // FIXME: use safeTransferFrom()
        collateralCurrency.transferFrom(msg.sender, address(this), collateralAmount);

    }

    /**
     * @dev To get the current collateralization ratio from the sender
     */
    function myCollateralizationRatio()
        public
        view
        returns (uint256 ratio)
    {
        PositionData storage positionData = positions[msg.sender];
        return _getCollateralizationRatio(positionData.rawCollateral, positionData.tokensOutstanding);
    }

    function getTokenCurrency()
        public
        view
        returns (address)
    {
        return address(tokenCurrency);
    }

    function getCollateralizationRatio(uint256 collateral, uint256 numTokens)
        public
        view
        returns (uint256 ratio)
    {
        return _getCollateralizationRatio(collateral, numTokens);
    }


    /****************************************
     *          INTERNAL FUNCTIONS          *
    ****************************************/
    modifier onlyCollateralizedPosition(address sponsor) {
        _onlyCollateralizedPosition(sponsor);
        _;
    }

    function _onlyCollateralizedPosition(address sponsor) internal view {
        require(
            (positions[sponsor].rawCollateral) > 0 ,
            "Position has no collateral"
        );
    }

    function _getPositionData(address sponsor)
        internal
        view
        onlyCollateralizedPosition(sponsor)
        returns (PositionData storage)
    {
        return positions[sponsor];
    }

    function _checkCollateralization(uint256 collateral, uint256 numTokens)
        private
        view
        returns (bool)
    {
        uint256 currentCR = collateralizationRatio;
        
        uint256 thisChange = _getCollateralizationRatio(collateral, numTokens);

        return !(currentCR > (thisChange));
    }

    function _getCollateralizationRatio(uint256 collateral, uint256 numTokens)
        private
        view
        returns (uint256 ratio)
    {
        uint256 currentRate = oracle.getValue();
        uint256 fullyBacked = collateral.mul(currentRate).div(1000000);
        return fullyBacked.mul(1000000).div(numTokens);
    }

    function _incrementCollateralBalances(
        PositionData storage positionData,
        uint256 collateralAmount
    ) internal {
        positionData.rawCollateral = positionData.rawCollateral.add(collateralAmount);
        rawTotalPositionCollateral = rawTotalPositionCollateral.add(collateralAmount);
    }

    

}
