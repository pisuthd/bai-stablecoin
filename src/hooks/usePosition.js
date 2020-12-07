import { useMemo, useEffect, useState, useCallback } from "react";
import PositionManager from "../abi/PositionManager.json"

export const usePosition = (address, account) => {

    const contract = useMemo(() => {
        if (!account || !address) {
            return
        }
        return new window.web3.eth.Contract(PositionManager.abi, address)
    }, [account, address])

    const [totalCollateralAmount, setTotalCollateralAmount] = useState("--");
    const [collateralizationRatio, setCollateralizationRatio] = useState("--");
    const [totalTokensOutstanding, setTotalTokensOutstanding] = useState("--");

    const getStats = useCallback(
        async () => {
            try {
                const totalCollateralAmountWei = await contract.methods.rawTotalPositionCollateral().call()
                const totalTokensOutstandingWei = await contract.methods.totalTokensOutstanding().call()
                const ratio = await contract.methods.collateralizationRatio().call()
        
                return {
                    totalCollateralAmount: Number(window.web3.utils.fromWei(totalCollateralAmountWei)).toLocaleString(),
                    collateralizationRatio: `${Number(ratio) / 10000}`,
                    totalTokensOutstanding: Number(window.web3.utils.fromWei(totalTokensOutstandingWei)).toLocaleString()
                }

            } catch (e) {
                return {
                    totalCollateralAmount: "--",
                    collateralizationRatio: "--",
                    totalTokensOutstanding: "--"
                }
            }
        },
        [contract]
    );

    useEffect(() => {
        contract && getStats().then(
            ({ totalCollateralAmount, collateralizationRatio, totalTokensOutstanding }) => {
                setTotalCollateralAmount(totalCollateralAmount)
                setCollateralizationRatio(collateralizationRatio)
                setTotalTokensOutstanding(totalTokensOutstanding)
            }
        );
    }, [account, getStats, contract]);

    return {
        totalCollateralAmount,
        collateralizationRatio,
        totalTokensOutstanding
    }
}