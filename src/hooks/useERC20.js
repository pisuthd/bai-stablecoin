import { useMemo, useEffect, useState, useCallback } from "react";
import Token from "../abi/SyntheticToken.json"

export const useERC20 = (address, account) => {

    const erc20Contract = useMemo(() => {
        if (!account || !address) {
            return
        }
        return new window.web3.eth.Contract(Token.abi, address)
    }, [account, address])

    const [balance, setBalance] = useState("--");

    const getBalance = useCallback(
        async () => {
            try {
                const balance = await erc20Contract.methods.balanceOf(account).call()
                return Number(window.web3.utils.fromWei(balance)).toLocaleString()
            } catch (e) { 
                return "--"
            }
        },

        [erc20Contract, account]
    );

    const approve = useCallback(
        async () => {
         const totalSupply = await erc20Contract?.methods.totalSupply().call()
          return erc20Contract?.methods.approve(
            process.env.REACT_APP_POSITION_MANAGER,
            totalSupply
          ).send({
              from : account
          })
        },
        [erc20Contract, account]
      );

    // (2 ** 256 - 1)

    useEffect(() => {
        erc20Contract && getBalance().then(setBalance);
    }, [account, getBalance, erc20Contract]);

    return {
        balance,
        approve
    }
}