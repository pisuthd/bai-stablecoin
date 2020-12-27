const TokenFactory = artifacts.require('TokenFactory')
const Oracle = artifacts.require('Oracle')
const SyntheticToken = artifacts.require("SyntheticToken")
const MockToken = artifacts.require("MockToken")
const BaiSystem = artifacts.require("BaiSystem")

const web3 = require("web3")

let mockTokenAddress;

let oracleInstance;
let tokenFactoryInstance;
let baiSystemInstance

contract('BaiSystem', accounts => {

    before(async () => {

        // Setup Mock DAI ERC-20
        const mock = await MockToken.new("DAI Token", "DAI")
        mockTokenAddress = mock.address

        // Setup Oracle
        oracleInstance = await Oracle.new();
        // Set USD/BAI = 30
        await oracleInstance.updateValue(30 * 1000000);
        await oracleInstance.confirmValueUpdate();

        tokenFactoryInstance = await TokenFactory.new()
    });

    it('verifies that Bai system contract can be deployed', async () => {
        baiSystemInstance = await BaiSystem.new(
            mockTokenAddress,
            oracleInstance.address,
            tokenFactoryInstance.address
        )

        const collateralCurrency = await baiSystemInstance.collateralCurrency()
        assert.equal(collateralCurrency, mockTokenAddress)
        const currentOracle = await baiSystemInstance.oracle()
        assert.equal(currentOracle, oracleInstance.address)
        const liquidationRatio = await baiSystemInstance.liquidationRatio()
        assert.equal(liquidationRatio.toString(), `${Number(1.05 * (1000000))}`)

    })

    it('verifies that account#1 can liquidates account#2 when the collateral ratio is under 105%', async () => {
        // setup a position for account#1
        const collateralAmount = "1500"
        const mintAmount = "30000"
        // Approve
        const DAIToken = await MockToken.at(mockTokenAddress)
        await DAIToken.approve(baiSystemInstance.address, await DAIToken.totalSupply())
        // Mint 30000 BAI
        await baiSystemInstance.create(web3.utils.toWei(collateralAmount), web3.utils.toWei(mintAmount))
        const tokenCurrencyAddress = await baiSystemInstance.getTokenCurrency()
        const syntheticToken = await SyntheticToken.at(tokenCurrencyAddress)
        const totalBAI = await syntheticToken.balanceOf(accounts[0])
        assert.equal(web3.utils.fromWei(totalBAI), "30000")

        // Setup a positon for account#2
        await DAIToken.transfer(accounts[1], web3.utils.toWei("150"))
        await DAIToken.approve(baiSystemInstance.address, await DAIToken.totalSupply(), {
            from: accounts[1]
        })
        // Mint 3000 BAI at 105% ratio
        await baiSystemInstance.create(web3.utils.toWei("105"), web3.utils.toWei("3000"), {
            from: accounts[1]
        })
        const totalBAI2 = await syntheticToken.balanceOf(accounts[1])
        assert.equal(web3.utils.fromWei(totalBAI2), "3000")
        const currentRatio = await baiSystemInstance.myCollateralizationRatio({
            from: accounts[1]
        })
        assert.equal(Number(currentRatio), 1.05 * 1000000)

        // Decrease USD/BAI to 29
        await oracleInstance.updateValue(29 * 1000000);
        await oracleInstance.confirmValueUpdate();

        const updatedRatio = await baiSystemInstance.myCollateralizationRatio({
            from: accounts[1]
        })

        // Ratio now should be < 105%
        assert.equal(1.05 * 1000000 > Number(updatedRatio), true)

        // Approve
        await syntheticToken.approve(baiSystemInstance.address, await syntheticToken.totalSupply())

        const liquidatorDAIBalanceBefore = await DAIToken.balanceOf(accounts[0])

        await baiSystemInstance.liquidate(accounts[1], web3.utils.toWei("3000"), {
            from: accounts[0]
        })

        const liquidatorDAIBalanceAfter = await DAIToken.balanceOf(accounts[0])

        assert.equal(Number(web3.utils.fromWei(liquidatorDAIBalanceAfter)) > Number(web3.utils.fromWei(liquidatorDAIBalanceBefore)), true)

        // Position should be closed thus can't identify its ratio
        let failure = false
        try {
            const liquidatedRatio = await baiSystemInstance.myCollateralizationRatio({
                from: accounts[1]
            })
        } catch (e) {
            failure = true
        }
        assert.equal(failure, true)

    })

})