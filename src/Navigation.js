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
import styled from "styled-components"
import { ContractsContext } from "./hooks/useContracts"
import { shortAddress } from "./utils"

const Navigation = styled(
    ({ className }) => {

        const { connect, disconnect, isConnected, account } = useContext(ContractsContext)

        const [isOpen, setIsOpen] = useState(false);

        const toggle = () => setIsOpen(!isOpen);

        return (
            <Container className={className}>
                <Navbar className="navbar" expand="md">
                    <NavbarBrand className="brand" href="/">BAI STABLECOIN</NavbarBrand>
                    <NavbarToggler onClick={toggle} />
                    <Collapse isOpen={isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            {!isConnected
                                ?
                                <NavItem>
                                    <Button onClick={() => connect()} color="info">Connect</Button>
                                </NavItem>
                                :
                                <UncontrolledDropdown nav inNavbar>
                                    <DropdownToggle nav caret>
                                        {account && shortAddress(account)}
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                        {/* <DropdownItem>
                                            Option 1
                                        </DropdownItem>
                                        <DropdownItem>
                                            Option 2
                                        </DropdownItem>
                                        <DropdownItem divider /> */}
                                        <DropdownItem onClick={() => disconnect()}>
                                            Disconnect
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            }

                        </Nav>

                    </Collapse>
                </Navbar>
            </Container>
        )
    })`

    a {
        color: white;
        font-weight: 600;
        
    }

    .brand {
        text-shadow: 2px 2px black;
    }
    .navbar { 
        height: 70px; 
    }

    `

export default Navigation