import React, { useState, useContext, useCallback, useEffect } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Row,
    Col,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarText,
    Container,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from 'reactstrap';
import Blockies from 'react-blockies';
import { Web3ReactProvider, useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import {
    Link
} from "react-router-dom";
import styled from "styled-components"
import { ContractsContext } from "./hooks/useContracts"
import { shortAddress } from "./utils"
import { ReactComponent as WardenLogo } from "./assets/warden-logo.svg"
import { ConnectButton } from "./components/common"
import WalletSVG from "./assets/wallet-icon.svg"
import useEagerConnect from "./hooks/useEagerConnect"
import useInactiveListener from "./hooks/useInactiveListener"
import MetamaskSVG from "./assets/metamask.svg"

import {
    injected
} from "./connectors"

const StyledNavItem = styled(NavItem)`
    padding-left: 1rem;
    padding-right: 1rem;
    margin-top: auto;
    margin-bottom: auto;
    text-align: center;
    font-weight: 600;
    :hover {
        text-decoration: underline;
    }
`

const StyledLink = styled(Link)`
    color: inherit; 
`
const Connector = styled.div`

    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 5px;

 
        font-size: 18px;
        font-weight: 600;
        text-transform: uppercase;


    :hover {
        cursor: pointer;
        background-color: #ddd;
    }

    display: flex;
    flex-direction: row;

    img {
        width: 48px;
        height: 48px;
    }

    div {
        flex: 70%;
        display: flex; 
        align-items: center;

        :first-child {
            flex: 20%;
        }
        :last-child {
            flex: 10%;
        }

    }

`

const BlockiesWrapper = styled.div`
    height: 40px;
    width: 40px; 
    border-radius: 50%;
    display: inline-block;
    overflow: hidden;
`

const Connectors = [
    {
        name: "Metamask",
        connector: injected,
        icon: MetamaskSVG
    }
]

const Navigation = () => {

    // const { connect, disconnect, isConnected, account } = useContext(ContractsContext)

    const [isOpen, setIsOpen] = useState(false);
    const [showModal, setModal] = useState(false);

    const context = useWeb3React()
    const { connector, library, chainId, account, activate, deactivate, active, error } = context

    // handle logic to recognize the connector currently being activated
    const [activatingConnector, setActivatingConnector] = useState()

    useEffect(() => {
        if (activatingConnector && activatingConnector === connector) {
            setActivatingConnector(undefined)
        }
    }, [activatingConnector, connector])


    // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
    const triedEager = useEagerConnect()

    // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
    useInactiveListener(!triedEager || !!activatingConnector)

    const toggle = () => setIsOpen(!isOpen);

    const toggleModal = useCallback(() => {
        setModal(!showModal)
    }, [showModal])

    useEffect(() => {
        if (error && error.message) {
            alert(error.message)
        }
    }, [error])

    return (
        <>
            <Navbar color="light" light expand="md">
                <Container>
                    <NavbarBrand href="/">
                        <WardenLogo height="35px" width="120px" />
                    </NavbarBrand>
                    <NavbarToggler onClick={toggle} />
                    <Collapse isOpen={isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <StyledNavItem>
                                <NavLink><StyledLink to="/home">Home</StyledLink></NavLink>
                            </StyledNavItem>
                            <StyledNavItem>
                                <NavLink><StyledLink to="/generateBAI">Generate BAI</StyledLink></NavLink>
                            </StyledNavItem>
                            <StyledNavItem>
                                <NavLink><StyledLink to="/stake">Stake</StyledLink></NavLink>
                            </StyledNavItem>
                            <StyledNavItem style={{ marginRight: "1rem" }}>
                                <NavLink><StyledLink to="/swap">Swap</StyledLink></NavLink>
                            </StyledNavItem>

                            {!account
                                ?
                                <NavItem>
                                    <ConnectButton onConnect={() => toggleModal()} icon={WalletSVG}>Connect</ConnectButton>
                                </NavItem>
                                :
                                <UncontrolledDropdown nav inNavbar>
                                    <DropdownToggle style={{ padding: 0 }} nav>
                                        {/* {account && shortAddress(account)} */}
                                        <BlockiesWrapper>
                                            <Blockies
                                                seed={account}
                                                size={10}
                                            />
                                        </BlockiesWrapper>

                                    </DropdownToggle>
                                    <DropdownMenu right>
                                        <DropdownItem disabled>
                                            {account && shortAddress(account)}
                                        </DropdownItem>
                                        <DropdownItem divider />
                                        <DropdownItem onClick={() => deactivate()}>
                                            Disconnect
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            }

                        </Nav>
                    </Collapse>
                </Container>
            </Navbar>
            <Modal isOpen={showModal} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>Choose Wallet Provider</ModalHeader>
                <ModalBody>
                    {Connectors.map((item, index) => {

                        const { connector, name, icon } = item

                        return (
                            <Connector
                                key={index}
                                onClick={() => {
                                    setActivatingConnector(connector)
                                    activate(connector)
                                    setModal(false)
                                }}
                            >
                                {/* <div style={{ margin: "auto" }}>
                                    <a href="#" onClick={() => {
                                        setActivatingConnector(connector)
                                        activate(connector)
                                        SetModal(false)
                                    }}>
                                        {name}
                                    </a>
                                </div> */}
                                <div>
                                    <img src={icon} />
                                </div>
                                <div>
                                    {name}
                                </div>
                                <div>
                                    {/* TODO : PUT CONNECTION STATUS */}
                                </div>
                            </Connector>
                        )
                    })
                    }
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggleModal}>Close</Button>
                </ModalFooter>
            </Modal>
        </>


    )
}


// const NavigationOLD = styled(
//     ({ className }) => {

//         const { connect, disconnect, isConnected, account } = useContext(ContractsContext)

//         const [isOpen, setIsOpen] = useState(false);

//         const toggle = () => setIsOpen(!isOpen);

//         return (
//             <Container className={className}>
//                 <Navbar className="navbar" expand="md">
//                     <NavbarBrand className="brand" href="/">BAI STABLECOIN</NavbarBrand>
//                     <NavbarToggler onClick={toggle} />
//                     <Collapse isOpen={isOpen} navbar>
//                         <Nav className="ml-auto" navbar>
//                             {!isConnected
//                                 ?
//                                 <NavItem>
//                                     <Button onClick={() => connect()} color="info">Connect</Button>
//                                 </NavItem>
//                                 :
//                                 <UncontrolledDropdown nav inNavbar>
//                                     <DropdownToggle nav caret>
//                                         {account && shortAddress(account)}
//                                     </DropdownToggle>
//                                     <DropdownMenu right>
//                                         <DropdownItem onClick={() => disconnect()}>
//                                             Disconnect
//                                         </DropdownItem>
//                                     </DropdownMenu>
//                                 </UncontrolledDropdown>
//                             }

//                         </Nav>

//                     </Collapse>
//                 </Navbar>
//             </Container>
//         )
//     })`

//     a {
//         color: white;
//         font-weight: 600;

//     }

//     .brand {
//         text-shadow: 2px 2px black;
//     }
//     .navbar { 
//         height: 70px; 
//     }

//     `



export default Navigation