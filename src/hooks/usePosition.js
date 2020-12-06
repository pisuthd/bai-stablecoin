import React, { useEffect, useMemo, useReducer, createContext } from 'react';
import Web3 from "web3"

export const PositionContext = createContext({});

const Provider = ({ children }) => {

    const [state, dispatch] = useReducer(
        (prevState, action) => {
            switch (action.type) {
                case 'UPDATE_ACCOUNT':
                    return {
                        ...prevState,
                        isConnected : action.data ? true : false ,
                        account: action.data
                    };
                default:
                    return {
                        ...prevState
                    }
            }
        },
        {
            isConnected : false 
        }
    )

    const { account, isConnected } = state;

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

    const positionContext = useMemo(
        () => ({
            connect,
            disconnect,
            account,
            isConnected
        }),
        [ account, isConnected]
    );

    useEffect(() => {
        async function listenAccount() {
            window.ethereum.on("accountsChanged", async function () {
                const accounts = await window.web3.eth.getAccounts();
                if (accounts && accounts[0]) {
                    dispatch({ type: 'UPDATE_ACCOUNT', data: accounts[0] });
                }
            });
        }
        listenAccount();
    }, []);

    return (
        <PositionContext.Provider value={positionContext}>
            {children}
        </PositionContext.Provider>
    )
}

export default Provider