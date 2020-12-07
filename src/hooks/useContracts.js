import React, { useEffect, useMemo, useReducer, createContext, useState } from 'react';
import Web3 from "web3"
import { useERC20 } from "./useERC20"
import { usePosition } from "./usePosition"

export const ContractsContext = createContext({});

const Provider = ({ children }) => {

    const [state, dispatch] = useReducer(
        (prevState, action) => {
            switch (action.type) {
                case 'UPDATE_ACCOUNT':
                    return {
                        ...prevState,
                        isConnected: action.data ? true : false,
                        account: action.data
                    };
                default:
                    return {
                        ...prevState
                    }
            }
        },
        {
            isConnected: false
        }
    )

    const { account, isConnected } = state;

    const daiERC20 = useERC20(process.env.REACT_APP_DAI_TOKEN_ADDRESS, account)
    const baiERC20 = useERC20(process.env.REACT_APP_BAI_TOKEN_ADDRESS, account)
    const baiPositionManager = usePosition(process.env.REACT_APP_POSITION_MANAGER, account)
    

    const connect = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            window.ethereum.enable();
            const accounts = await window.web3.eth.getAccounts()
            if (accounts && accounts[0]) {
                dispatch({ type: 'UPDATE_ACCOUNT', data: accounts[0] });
            }
            return true;
        }
        return false;
    }

    const disconnect = async () => {
        dispatch({ type: 'UPDATE_ACCOUNT', data: undefined });
    }

    const contractsContext = useMemo(
        () => ({
            connect,
            disconnect,
            account,
            isConnected,
            daiERC20,
            baiERC20,
            baiPositionManager
        }),
        [account, isConnected, daiERC20, baiERC20, baiPositionManager]
    );

    useEffect(() => {
        async function listenAccount() {

            if (window.ethereum) {
                window.ethereum.on("accountsChanged", async function () {
                    const accounts = await window.web3.eth.getAccounts();
                    if (accounts && accounts[0]) {
                        dispatch({ type: 'UPDATE_ACCOUNT', data: accounts[0] });
                    }
                });
            }

        }
        listenAccount();
    }, []);



    return (
        <ContractsContext.Provider value={contractsContext}>
            {children}
        </ContractsContext.Provider>
    )
}

export default Provider