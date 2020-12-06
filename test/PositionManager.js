const PositionManager = artifacts.require('PositionManager')
const TokenFactory = artifacts.require('TokenFactory')
const Oracle = artifacts.require('Oracle')
const SyntheticToken = artifacts.require("SyntheticToken")
const MockToken = artifacts.require("MockToken")

const web3 = require("web3")

let mockTokenAddress;

let oracleInstance;
let tokenFactoryInstance;
let positionManagerInstance;

contract('PositionManager', accounts => {
    before(async () => {

        // Setup ERC20
        const mock = await MockToken.new("USD Token", "USD")
        mockTokenAddress = mock.address

        // Setup Oracle
        oracleInstance = await Oracle.new();
        // Set USD/BAI = 30
        await oracleInstance.updateValue(30 * 1000000);
        await oracleInstance.confirmValueUpdate();

        tokenFactoryInstance = await TokenFactory.new()
    });

    it('verifies that can construct Position Manager', async () => {
        positionManagerInstance = await PositionManager.new(
            mockTokenAddress,
            oracleInstance.address,
            "Test Synthetics",
            "TEST",
            tokenFactoryInstance.address,
            1.05 * (1000000) // PPM
        )

        const collateralCurrency = await positionManagerInstance.collateralCurrency()
        assert.equal(collateralCurrency, mockTokenAddress)
        const currentOracle = await positionManagerInstance.oracle()
        assert.equal(currentOracle, oracleInstance.address)
        const collateralizationRatio = await positionManagerInstance.collateralizationRatio()
        assert.equal(collateralizationRatio.toString(), `${Number(1.05 * (1000000))}`)

    });

    it('Create first position at 150% ratio', async () => {
        // Minting 3000 TEST from 150 USD at 150% collateral ratio
        const collateralAmount = "150"
        const mintAmount = "3000"
        const cr = await positionManagerInstance.getCollateralizationRatio(web3.utils.toWei(collateralAmount), web3.utils.toWei(mintAmount));
        assert.isAbove(Number(cr) / 1000000, 1.05)

        // Approve
        const USDToken = await MockToken.at(mockTokenAddress)
        await USDToken.approve(positionManagerInstance.address, await USDToken.totalSupply())

        const tokenCurrencyAddress = await positionManagerInstance.getTokenCurrency()
        const syntheticToken = await SyntheticToken.at(tokenCurrencyAddress)
        const beforeMint = await syntheticToken.balanceOf(accounts[0])
        assert.equal(Number(beforeMint), 0)
        await positionManagerInstance.create(web3.utils.toWei(collateralAmount), web3.utils.toWei(mintAmount))
        const afterMint = await syntheticToken.balanceOf(accounts[0])
        assert.equal(web3.utils.fromWei(afterMint), "3000")
        
    })

    it('Create second position at 125% ratio with another account', async () => {
        // Minting 3000 TEST from 125 USD at 125% collateral ratio
        const collateralAmount = "125"
        const mintAmount = "3000"

        // Approve
        const USDToken = await MockToken.at(mockTokenAddress)
        await USDToken.transfer(accounts[1], web3.utils.toWei("125"))
        await USDToken.approve(positionManagerInstance.address, await USDToken.totalSupply(), {
            from: accounts[1],
        })

        const tokenCurrencyAddress = await positionManagerInstance.getTokenCurrency()
        const syntheticToken = await SyntheticToken.at(tokenCurrencyAddress)
        const beforeMint = await syntheticToken.balanceOf(accounts[1])
        assert.equal(Number(beforeMint), 0)
        await positionManagerInstance.create(web3.utils.toWei(collateralAmount), web3.utils.toWei(mintAmount), {
            from: accounts[1],
        })
        const afterMint = await syntheticToken.balanceOf(accounts[1])
        assert.equal(web3.utils.fromWei(afterMint), "3000")

    })

    it('Create third position with CR belows than 105%', async () => {
        // Minting 3000 TEST from 90 USD at 90% collateral ratio
        const collateralAmount = "90"
        const mintAmount = "3000"

        // Approve
        const USDToken = await MockToken.at(mockTokenAddress)
        await USDToken.transfer(accounts[2], web3.utils.toWei("90"))
        await USDToken.approve(positionManagerInstance.address, await USDToken.totalSupply(), {
            from: accounts[2],
        })

        let isFailed = false;
        try {
            await positionManagerInstance.create(web3.utils.toWei(collateralAmount), web3.utils.toWei(mintAmount), {
                from: accounts[2],
            })
        } catch (e) {
            isFailed = true
        }

        assert.equal(isFailed, true)

    })

    it("Add more collateral" , async () => {
        const currentRatio = await positionManagerInstance.myCollateralizationRatio()
        const depositAmount = "50"
        await positionManagerInstance.deposit(web3.utils.toWei(depositAmount) )
        const afterRatio = await positionManagerInstance.myCollateralizationRatio()
        assert.equal(afterRatio > currentRatio , true)
    })

    

})