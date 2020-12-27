import React, { useState, useContext } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarText,
    Container,
    Button
} from 'reactstrap';
import {
    Link
} from "react-router-dom";
import styled from "styled-components"
import { ContractsContext } from "./hooks/useContracts"
import { shortAddress } from "./utils"
import { ReactComponent as WardenLogo } from "./assets/warden-logo.svg"
import { ConnectButton } from "./components/common"
import WalletSVG from "./assets/wallet-icon.svg"

const StyledNavItem = styled(NavItem)`
    padding-left: 1rem;
    padding-right: 1rem;
    text-align: center;
    font-weight: 600;
    :hover {
        text-decoration: underline;
    }
`

const StyledLink = styled(Link)`
    color: inherit;
`


const Navigation = () => {

    const { connect, disconnect, isConnected, account } = useContext(ContractsContext)

    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return (

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

                        {!isConnected
                            ?
                            <NavItem>
                                <ConnectButton icon={WalletSVG}>Connect</ConnectButton>
                            </NavItem>
                            :
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle nav caret>
                                    {account && shortAddress(account)}
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem onClick={() => disconnect()}>
                                        Disconnect
                                </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        }

                    </Nav>
                </Collapse>
            </Container>
        </Navbar>

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