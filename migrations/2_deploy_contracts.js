const TokenFactory = artifacts.require("TokenFactory");
const Oracle = artifacts.require('Oracle')
const BaiSystem = artifacts.require('BaiSystem')

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

    // Setup Bai System
    await deployer.deploy(
        BaiSystem,
        DAI_TOKEN_ADDRESS,
        Oracle.address,
        TokenFactory.address
    )

    const baiSystemInstance = await BaiSystem.at(BaiSystem.address);
    const baiTokenAddress = await baiSystemInstance.getTokenCurrency()

    await fs.writeFileSync(
        ".env",
        `
REACT_APP_DAI_TOKEN_ADDRESS=${DAI_TOKEN_ADDRESS}
REACT_APP_ORACLE_ADDRESS=${Oracle.address}
REACT_APP_TOKEN_FACTORY_ADDRESS=${TokenFactory.address}
REACT_APP_BAI_SYSTEM=${BaiSystem.address}
REACT_APP_BAI_TOKEN_ADDRESS=${baiTokenAddress}
`
    );

}