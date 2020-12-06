const TokenFactory = artifacts.require("TokenFactory");
const Oracle = artifacts.require('Oracle')
const PositionManager = artifacts.require('PositionManager')

const fs = require("fs");

const DAI_TOKEN_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f"

module.exports = async (deployer, network, accounts) => {

    // Setup oracle
    await deployer.deploy(Oracle);

    const oracleInstance = await Oracle.at(Oracle.address);
    // set initial rate
    await oracleInstance.updateValue(30 * 1000000);
    await oracleInstance.confirmValueUpdate();

    // Setup token factory
    await deployer.deploy(TokenFactory);

    // Setup position manager for BAI
    await deployer.deploy(
        PositionManager,
        DAI_TOKEN_ADDRESS,
        Oracle.address,
        "BAI Stablecoin",
        "BAI",
        TokenFactory.address,
        1.05 * (1000000) // Default Liquidation Ratio - 105%
    );

    const positionManagerInstance = await PositionManager.at(PositionManager.address);
    const baiTokenAddress = await positionManagerInstance.getTokenCurrency()

    await fs.writeFileSync(
        ".env",
        `
DAI_TOKEN_ADDRESS=${DAI_TOKEN_ADDRESS}
ORACLE_ADDRESS=${Oracle.address}
TOKEN_FACTORY_ADDRESS=${TokenFactory.address}
POSITION_MANAGER=${PositionManager.address}
BAI_TOKEN_ADDRESS=${baiTokenAddress}
`
    );

}